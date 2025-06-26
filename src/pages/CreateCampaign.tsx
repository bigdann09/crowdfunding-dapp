import { zodResolver } from "@hookform/resolvers/zod";
import { useNetworkVariable } from '@/config/networkconfig';
import { Transaction } from '@mysten/sui/transactions';
import { useSignTransaction, useSuiClient } from '@mysten/dapp-kit';
import { DEVNET_CROWDFUNDING_DASHBOARD } from '@/lib/constants';
import { useState } from 'react';
import { toast } from 'sonner';
import { createCampaignSchema } from '@/lib/schemas/campaign';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";

const CreateCampaign = () => {
    const client = useSuiClient()
    const packageID = useNetworkVariable("crowdfundingPackageID")
    const { mutateAsync: signTransactionBlock } = useSignTransaction()
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    // update zod
    const {
        formState: { errors },
        register,
        reset,
        handleSubmit,
    } = useForm({ resolver: zodResolver(createCampaignSchema) });

    const createCampaign = async (data: any) => {
        const startTime = BigInt(Math.floor(data.startDate.getTime()));
        const endTime = BigInt(Math.floor(data.endDate.getTime()));
        const goal = BigInt(data.goal);
        const title = data.title;
        const description = data.description;

        try {
            setIsLoading(true)
            const tx = new Transaction();
            tx.moveCall({
                arguments: [
                    tx.object(DEVNET_CROWDFUNDING_DASHBOARD),
                    tx.pure.string(title),
                    tx.pure.string(description),
                    tx.pure.u64(startTime),
                    tx.pure.u64(endTime),
                    tx.pure.u64(goal),
                    tx.object.clock()
                ],
                target: `${packageID}::crowdfunding::create_campaign`
            });

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
            navigate("/")

        } catch(error) {
            console.error('Error creating campaign:', error);
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <main className='w-[70%] md:w-[60%] lg:w-[55%] mx-auto pt-5'>
            <div className='w-full bg-neutral-950 p-4 rounded-lg'>
                <h4 className="text-lg md:text-xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-3">Create A Campaign</h4>
                <form onSubmit={handleSubmit(createCampaign)} className='space-y-2'>
                    <div className="space-y-1">
                        <label htmlFor="title" className='text-[1.1rem]'>Title</label>
                        <input
                            type="text"
                            className='w-full h-[3rem] rounded-md px-2 input'
                            {...register('title')}
                        />
                        {errors.title && (
                            <span className='text-red-300 text-xs'>{errors?.title?.message as string}</span>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="goal" className='text-[1.1rem]'>Target Amount</label>
                        <input
                            type="number"
                            className='w-full h-[3rem] rounded-md px-2 input'
                            {...register('goal')}
                        />
                        {errors.goal && (
                            <span className='text-red-300 text-xs'>{errors?.goal?.message as string}</span>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="startDate" className='text-[1.1rem]'>Start Date</label>
                        <input
                            type='datetime-local'
                            className='w-full h-[3rem] rounded-md px-2 input'
                            {...register('startDate')}
                        />
                        {errors.startDate && (
                            <span className='text-red-300 text-xs'>{errors?.startDate?.message as string}</span>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="endDate" className='text-[1.1rem]'>End Date</label>
                        <input
                            type='datetime-local'
                            className='w-full h-[3rem] rounded-md px-2 input'
                            {...register('endDate')}
                        />
                        {errors.endDate && (
                            <span className='text-red-300 text-xs'>{errors?.endDate?.message as string}</span>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="description" className='text-[1.1rem]'>Description/Story</label>
                        <textarea
                            className='block w-full resize-none h-[7rem] rounded-md input p-3'
                            {...register('description')}
                        ></textarea>
                        {errors.description && (
                            <span className='text-red-300 text-xs'>{errors?.description?.message as string}</span>
                        )}
                    </div>
                    <div>
                        <button className='w-full py-2 px-4 rounded-md bg-sky-800 flex items-center justify-center gap-x-3' disabled={isLoading}>
                            {isLoading && (<span className='inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin'></span>)}
                            <span>Create Campaign</span>
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}

export default CreateCampaign