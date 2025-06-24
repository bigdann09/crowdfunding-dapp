import { Campaign } from '../components/Campaign';
import useDashboard from '@/hooks/useDashboard';

const Home = () => {
    // retrieve campaigns and reverse the slice to show new campaigns added
    const { parse, data, isPending } = useDashboard()
    const campaigns = parse(data?.data)?.campaigns.slice().reverse()

    return (
        <>
            <section className='py-6'>
                {campaigns?.length > 0 ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4 py-2'>
                        {isPending ? (
                            <div className='px-6'>Loading...</div>
                        ): (
                            <>
                                {campaigns?.map((campaign, idx) => (
                                    <Campaign
                                        key={idx}
                                        id={campaign}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                ) : (
                    <div className='w-full h-[60vh] flex items-center justify-center'>
                        <div className='flex flex-col items-center'>
                            <h3 className='font-bold sm:text-[1.5rem] md:text-3xl'>There are no campaigns in the dashboard</h3>
                            <span className='text-sm'>Create a campaign..</span>
                        </div>
                    </div>
                )}
            </section>
        </>
    )
}

export default Home