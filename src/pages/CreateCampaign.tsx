import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod'
import { useNetworkVariable } from '@/config/networkconfig';
import { Transaction } from '@mysten/sui/transactions';
import { useSignTransaction, useSuiClient } from '@mysten/dapp-kit';
import { DEVNET_CROWDFUNDING_DASHBOARD } from '@/lib/constants';
import { useState } from 'react';
import { toast } from 'sonner';

const CreateCampaign = () => {
    const client = useSuiClient()
    const packageID = useNetworkVariable("crowdfundingPackageID")
    const { mutateAsync: signTransactionBlock } = useSignTransaction()
    const [isLoading, setIsLoading] = useState(false)

    const createCampaignSchema = z.object({
        title: z.string()
            .min(10, { message: "Title must be at least 10 characters long" }),
        goal: z.coerce.number()
            .min(5, { message: "Goal must be at least 5" }),
        startDate: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
            message: "Invalid start datetime",
          }),
        endDate: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
            message: "Invalid end datetime",
        }),
        description: z.string()
            .min(5, { message: "Description must be at least 5 characters long" })
    }).refine((data) => data.endDate > data.startDate, {
        message: "End date must be after start date",
        path: ["endDate"],
    });

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

            const textEncoder = new TextEncoder();
            const titleBytes = textEncoder.encode(title);
            const descriptionBytes = textEncoder.encode(description);
            const tx = new Transaction();
            tx.moveCall({
                arguments: [
                    tx.object(DEVNET_CROWDFUNDING_DASHBOARD),
                    tx.pure(titleBytes),
                    tx.pure(descriptionBytes),
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
                <h4 className="text-lg md:text-xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-3">Create A Crowdfund Campaign</h4>
                <form onSubmit={handleSubmit(createCampaign)} className='space-y-2'>
                    <div className="space-y-1">
                        <label htmlFor="title" className='text-[1.1rem]'>Title</label>
                        <input
                            type="text"
                            className='w-full h-[3rem] rounded-md px-2 input'
                            {...register('title')}
                        />
                        <span className='text-red-300 text-xs'>{errors?.title?.message}</span>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="goal" className='text-[1.1rem]'>Target Amount</label>
                        <input
                            type="number"
                            className='w-full h-[3rem] rounded-md px-2 input'
                            {...register('goal')}
                        />
                        <span className='text-red-300 text-xs'>{errors?.goal?.message}</span>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="startDate" className='text-[1.1rem]'>Start Date</label>
                        <input
                            type='datetime-local'
                            className='w-full h-[3rem] rounded-md px-2 input'
                            {...register('startDate')}
                        />
                        <span className='text-red-300 text-xs'>{errors?.startDate?.message}</span>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="endDate" className='text-[1.1rem]'>End Date</label>
                        <input
                            type='datetime-local'
                            className='w-full h-[3rem] rounded-md px-2 input'
                            {...register('endDate')}
                        />
                        <span className='text-red-300 text-xs'>{errors?.endDate?.message}</span>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="description" className='text-[1.1rem]'>Description/Story</label>
                        <textarea
                            className='block w-full resize-none h-[7rem] rounded-md input p-3'
                            {...register('description')}
                        ></textarea>
                        <span className='text-red-300 text-xs'>{errors?.description?.message}</span>
                    </div>
                    <div>
                        <button className='w-full py-2 px-4 rounded-md bg-sky-800 flex items-center justify-center gap-x-3'>
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