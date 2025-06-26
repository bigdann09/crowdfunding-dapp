import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useNavigate, useParams } from "react-router-dom";
import useCampaign from "@/hooks/useCampaign";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "@/config/networkconfig";
import { useCurrentAccount, useSignTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { donateSchema } from "@/lib/schemas/donate";
import { formatAddress, fromSui, toSui } from "@/lib/utils/util";
import { useCountdown } from "@/hooks/useCountdown";
import { DEVNET_CROWDFUNDING_DASHBOARD } from "@/lib/constants";

interface Field {
    key: string;
    value: string;
}
interface Donation {
    fields: Field;
    type: string
}

interface id {
    id: string
}

const Campaign = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [isCreator, setIsCreator] = useState(false)
    const [campaignCap, setCampaignCap] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [field, setField] = useState<Field | null>(null)

    const client = useSuiClient()
    const account = useCurrentAccount()
    const packageID = useNetworkVariable("crowdfundingPackageID")
    const { mutateAsync: signTransactionBlock } = useSignTransaction()

    // react hook form for donate schema
    const { register, handleSubmit, reset, formState: {errors} } = useForm({ resolver: zodResolver(donateSchema) })

    const { address } = useParams()
    const navigate = useNavigate()

    if (address == undefined) {
        navigate("/")
        return
    }

    const { parse, response, isPending, error , refetch } = useCampaign({id: address})

    const campaign = parse(response?.data)
    const startTime = useMemo(() => (campaign ? parseInt(campaign?.startTime, 10) : null), [campaign]);
    const endTime = useMemo(() => (campaign ? parseInt(campaign?.endTime, 10) : null), [campaign]);

    // get campaign countdown and status
    const { countdown, status } = useCountdown(startTime, endTime);

    if (error) {
        toast.error(`${error}`)
        navigate("/")
    }

    useEffect(() => {
        if (account?.address) {
            setIsCreator(account?.address == campaign?.creator ? true : false);

            // get campaign capability
            (async () => {
                const objects = await client.getOwnedObjects({
                    owner: account.address,
                    options: { showType: true, showContent: true},
                    filter: {
                        StructType: `${packageID}::crowdfunding::CampaignCap`
                    }
                });

                for (const obj of objects.data) {
                    if (obj?.data?.content?.dataType == "moveObject") {
                        const fields = obj.data?.content?.fields;
                        if (fields?.campaign_id === campaign?.id.id) {
                            setCampaignCap(fields?.id?.id)
                        }
                    }
                }
            })()
        }
    }, [account, campaign])

    const raised = fromSui(campaign?.donations);
    const donors = campaign?.donors?.fields.contents;

    async function donateFunds(data: any) {
        if (account?.address == null) return toast.error('Connect wallet to donate funds');

        const balance = await client.getBalance({
            owner: account?.address!,
            coinType: "0x2::sui::SUI"
        })

        if (fromSui(Number(balance.totalBalance)) == 0) {
            toast.error("insufficient balance")
            return
        }

        const amount = toSui(parseFloat(data.amount));

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

    async function claimfunds() {
        try {
            setIsLoading(true)
            const tx = new Transaction()
            tx.moveCall({
                arguments: [
                    tx.object(DEVNET_CROWDFUNDING_DASHBOARD),
                    tx.object(campaignCap!),
                    tx.object(address!),
                    tx.object.clock()
                ],
                target: `${packageID}::crowdfunding::claim_funds`
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
            refetch()
            setModalOpen(false)

            toast.success(`Campaign funds claimed successfully`)

        } catch(error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    async function unpledge(amount: number) {
        try {
            setIsLoading(true)
            const tx = new Transaction()
            tx.moveCall({
                arguments: [
                    tx.object(address!),
                    tx.pure.u64(amount),
                    tx.object.clock()
                ],
                target: `${packageID}::crowdfunding::unpledge`
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
            refetch()
            setModalOpen(false)

            toast.success(`Amount ${fromSui(amount)} SUI has been successfully unpledged`)

        } catch(error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    async function cancel() {
        if (!isCreator) return toast.error("unauthorized request");

        try {
            setIsLoading(true)

            const tx = new Transaction();
            tx.moveCall({
                arguments: [
                    tx.object(DEVNET_CROWDFUNDING_DASHBOARD),
                    tx.object(campaignCap!),
                    tx.object(address!),
                    tx.object.clock()
                ],
                target: `${packageID}::crowdfunding::cancel`
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
            refetch()

        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    if (!response?.data) return null
    if (isPending) return <div>Loading..</div>

    return (
        <main>
            {modalOpen && (
                <div
                    onClick={() => setModalOpen(false)}
                    className="w-full h-full fixed top-0 left-0 bg-neutral-900/10 backdrop-blur-md z-10 flex items-center justify-center">
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-[70%] lg:w-[50%] h-auto bg-neutral-800 rounded-md p-4 shadow-sm">
                        <h3 className="font-bold text-center text-xl">Continue to action</h3>
                        {field != null && (
                            <div className="mt-6 flex justify-center gap-x-3">
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="w-1/2 p-2 bg-neutral-900 rounded-full hover:bg-neutral-950 transition-all duration-300">Cancel</button>
                                <button
                                    onClick={() => unpledge(Number(field?.value))}
                                    className="w-1/2 p-2 bg-sky-700 rounded-full hover:bg-sky-800 transition-all duration-300 flex items-center gap-x-3 justify-center">
                                        {isLoading && (<span className='inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin'></span>)}
                                        <span>Confirm</span>
                                    </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <section className='w-full relative py-3 mt-4 grid lg:grid-cols-1 px-2'>
                <div className='h-[5rem] bg-gradient-to-br from-transparent via-cyan-500 to-transparent rounded-md relative before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gray-700/20 before:rounded-md'></div>
                <div className='w-full flex flex-row items-center justify-center py-4 gap-x-3 gap-y-3'>
                    <div className='w-[30%] md:w-[70%] bg-gray-800 shadow-sm rounded-md py-1'>
                        <h2 className='font-bold text-lg text-center bg-gray-900'>Days Left</h2>
                        <p className='text-[1.7rem] lg:text-[1.9rem] text-center py-1'>{countdown.replace("remaining", "")}</p>
                    </div>
                    <div className='w-[30%] md:w-[70%] bg-gray-800 shadow-sm rounded-md py-1'>
                        <h2 className='font-bold text-lg text-center bg-gray-900'>Target</h2>
                        <p className='text-3xl text-center py-2'>{campaign?.goal.toLocaleString()} sui</p>
                    </div>
                    <div className='w-[30%] md:w-[70%] bg-gray-800 shadow-sm rounded-md py-1'>
                        <h2 className='font-bold text-lg text-center bg-gray-900'>Raised</h2>
                        <p className='text-3xl text-center py-2'>{raised.toLocaleString()} SUI</p>
                    </div>
                </div>
            </section>
            <section className={`grid grid-cols-1 ${isCreator ? 'grid-cols-1' : 'md:grid-cols-[66%_30%]'} items-start gap-x-4 px-3 pb-12 gap-y-4`}>
                <div className='py-2 space-y-4 order-2 md:order-1'>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className='text-lg font-bold'>Creator:</h4>
                            <div className='flex items-center  gap-x-2 mt-2'>
                                <div className='relative w-[2rem] h-[2rem] rounded-full bg-red-400 before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-full before:bg-blue-100 before:backdrop-blur-[10rem]'></div>
                                <p className='text-lg font-bold'>{formatAddress(campaign.creator)}</p>
                            </div>
                        </div>
                        {isCreator && (
                            <div className="flex items-center gap-x-3">
                                {status == "active" && campaign?.donations == 0 && (
                                    <button
                                    onClick={cancel}
                                    className="bg-red-700 text-white p-2 rounded-md font-bold">
                                    Cancel Campaign
                                </button>
                                )}

                                {status == "ended" && campaign?.donations > 0  && (
                                    <button
                                        onClick={claimfunds}
                                        className="bg-sky-700 text-white p-2 rounded-md font-bold">
                                        Claim Funds
                                    </button>
                                )}

                                {campaign?.status?.variant == "Cancelled" && (
                                    <div className="flex items-center gap-1 font-bold">
                                        <span className="text-sm">Status: </span>
                                        <span className="bg-red-700 rounded-lg px-2 font-bold">{campaign?.status?.variant}</span>
                                    </div>
                                )}
                            </div>
                        )}
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
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(donors as Donation[]).length > 0 ? (
                                    <>
                                        {(donors as Donation[]).map((donor, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell className="font-medium">{formatAddress(donor.fields.key, 12)}</TableCell>
                                                <TableCell>{fromSui(donor?.fields?.value).toLocaleString()} SUI</TableCell>
                                                <TableCell>
                                                    {account?.address == donor?.fields?.key && (
                                                        <button
                                                        onClick={() => {
                                                            setModalOpen(true)
                                                            setField({
                                                                key: donor?.fields?.key,
                                                                value: donor?.fields?.value
                                                            })
                                                        }}
                                                        className="bg-sky-700 text-white py-1 px-2 rounded-md">unpledge</button>
                                                    )}
                                                </TableCell>
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
                <div className={`bg-gray-800 shadow-md border border-gray-900 rounded-md p-3 px-4 mt-6 order-1 md:order-2 ${isCreator ? 'hidden' : 'block'}`}>
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
                            <button type='submit' className='w-full h-[3rem] bg-sky-800 rounded-md outline-none hover:scale-[1.05] duration-300 flex gap-x-2 items-center justify-center' disabled={isLoading || status == "ended" || status == "upcoming"}>
                                {isLoading && (<span className='inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin'></span>)}
                                {status == "upcoming" ? (
                                    <span>{countdown}</span>
                                ) : status == "active" ? (
                                    <span>Fund Campaign</span>
                                ) : (
                                    <>
                                        {status == "ended" && (<span>Ended</span>)}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </section >
        </main >
    )
}

export default Campaign