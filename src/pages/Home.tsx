import { Campaign } from '../components/Campaign';
import useDashboard from '@/hooks/useDashboard';

const Home = () => {
    // retrieve campaigns and reverse the slice to show new campaigns added
    const { parse, data, isPending, error } = useDashboard()
    const campaigns = parse(data?.data)?.campaigns.slice().reverse()

    console.log(campaigns, error)
    return (
        <>
            <section className='py-6'>
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
            </section>
        </>
    )
}

export default Home