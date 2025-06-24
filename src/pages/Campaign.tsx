import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import One from '../assets/one.jpeg'
import { useNavigate, useParams } from "react-router-dom";
import useCampaign from "@/hooks/useCampaign";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "@/config/networkconfig";
import { useSignTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useState } from "react";
import { toast } from "sonner";
import { donateSchema } from "@/lib/schemas/donate";

interface Field {
    key: string;
    value: string;
}
interface Donation {
    fields: Field;
    type: string
}

const Campaign = () => {
    const [isLoading, setIsLoading] = useState(false)

    const client = useSuiClient()
    const packageID = useNetworkVariable("crowdfundingPackageID")
    const { mutateAsync: signTransactionBlock } = useSignTransaction()

    const { register, handleSubmit, reset, formState: {errors} } = useForm({ resolver: zodResolver(donateSchema) })

    const { address } = useParams()
    const navigate = useNavigate()

    if (address == undefined) {
        navigate("/")
        return
    }

    function formatAddress(address: string, length = 6) {
        let start = address.substring(0, length)
        let end = address.substring(address.length - length)
        return `${start}****${end}`
    }

    const { parse, response, isPending, error , refetch } = useCampaign({id: address})

    if (error) {
        toast.error(`${error}`)
        navigate("/")
    }

    if (!response?.data) return null
    if (isPending) return <div>Loading..</div>

    const campaign = parse(response.data)
    const raised = campaign.donations / 1000000000;
    const donors = campaign.donors.fields.contents

    async function donateFunds(data: any) {
        const amount = Math.floor(parseFloat(data.amount) * 1_000_000_000);

        try {
            setIsLoading(true)
            const tx = new Transaction();

            const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(amount)]);

            tx.moveCall({
                arguments: [
                    tx.object(address!),
                    coin,
                    tx.object.clock()
                ],
                target: `${packageID}::crowdfunding::pledge`
            })

            const signature = await signTransactionBlock({
                transaction: tx,
            });

            const result = await client.executeTransactionBlock({
                transactionBlock: signature.bytes,
                signature: signature.signature,
                options: {
                    showEffects: true,
                    showObjectChanges: true,
                },
            });

            const status = result.effects?.status?.status;
            if (status !== 'success') {
                toast.error(`Transaction failed: ${result.effects?.status?.error || 'Unknown error'}`);
            }

            const digest = result.digest;
            console.log('Transaction successful, digest:', digest);
            toast.success(`Transaction successfull ${digest}`)
            reset()
            refetch()

        } catch(error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main>
            <section className='w-full relative py-3 mt-4 grid lg:grid-cols-[75%_25%] px-2'>
                <div className='bg-green-700 h-[18rem] rounded-md relative before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gray-700/20 before:rounded-md'>
                    <img src={One} alt={"ddd"} className='w-full h-full object-cover rounded-md' />
                </div>
                <div className='w-full flex flex-row lg:flex-col items-center justify-center py-4 gap-x-3 gap-y-3'>
                    <div className='w-[33.3%] md:w-[70%] bg-gray-800 shadow-sm rounded-md py-1'>
                        <h2 className='font-bold text-lg text-center bg-gray-900'>Days Left</h2>
                        <p className='text-[1.9rem] text-center py-1'>3</p>
                    </div>
                    <div className='w-[33.3%] md:w-[70%] bg-gray-800 shadow-sm rounded-md py-1'>
                        <h2 className='font-bold text-lg text-center bg-gray-900'>Target</h2>
                        <p className='text-3xl text-center py-2'>{campaign.goal.toLocaleString()} sui</p>
                    </div>
                    <div className='w-[33.3%] md:w-[70%] bg-gray-800 shadow-sm rounded-md py-1'>
                        <h2 className='font-bold text-lg text-center bg-gray-900'>Raised</h2>
                        <p className='text-3xl text-center py-2'>{raised.toLocaleString()} SUI</p>
                    </div>
                </div>
            </section>
            <section className='grid grid-cols-1 md:grid-cols-[66%_30%] items-start gap-x-4 px-3 pb-12 gap-y-4'>
                <div className='py-2 space-y-4 order-2 md:order-1'>
                    <div>
                        <h4 className='text-lg font-bold'>Creator:</h4>
                        <div className='flex items-center  gap-x-2 mt-2'>
                            <div className='relative w-[2rem] h-[2rem] rounded-full bg-red-400 before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-full before:bg-blue-100 before:backdrop-blur-[10rem]'></div>
                            <p className='text-lg font-bold'>{formatAddress(campaign.creator)}</p>
                        </div>
                    </div>
                    <div>
                        <h4 className='text-lg font-bold'>Description:</h4>
                        <p>{campaign.description}</p>
                    </div>
                    <div className='py-5 bg-neutral-900 px-2 rounded-md shadow-sm'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Address</TableHead>
                                    <TableHead>Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(donors as Donation[]).length > 0 ? (
                                    <>
                                        {(donors as Donation[]).map((donor, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell className="font-medium">{formatAddress(donor.fields.key, 12)}</TableCell>
                                                <TableCell>{(Number(donor.fields.value) / 1_000_000_000).toLocaleString()} SUI</TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                ): (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center">No donations made.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <div className='bg-gray-800 shadow-md border border-gray-900 rounded-md p-3 px-4 mt-6 order-1 md:order-2'>
                    <form onSubmit={handleSubmit(donateFunds)}>
                        <div className='flex flex-col space-y-1'>
                            <label htmlFor="title">Amount</label>
                            <input
                                type='test'
                                className='h-[2.5rem] rounded-md px-2 outline-none'
                                placeholder='0.0 SUI'
                                {...register('amount')}
                            />
                            <span className='text-red-300 text-xs'>{errors?.amount?.message}</span>
                        </div>
                        <div className='mt-4'>
                            <button type='submit' className='w-full h-[3rem] bg-sky-800 rounded-md outline-none hover:scale-[1.05] duration-300 flex gap-x-2 items-center justify-center' disabled={isLoading}>
                                {isLoading && (<span className='inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin'></span>)}
                                <span>Fund Campaign</span>
                            </button>
                        </div>
                    </form>
                </div>
            </section >
        </main >
    )
}

export default Campaign