import { Campaign } from '../components/Campaign';
import { useSuiClient, useSuiClientQuery } from '@mysten/dapp-kit';
import { useNetworkVariable } from '@/config/networkconfig';
import {SuiObjectData } from '@mysten/sui/client';
import One from '../assets/one.jpeg'

const funds = [
    {
        "title": "Dann the card",
        "description": "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos cupiditate autem et iste, ut laudantium soluta quidem ad beatae. Eum ducimus nostrum eligendi culpa fuga aliquid unde ipsa repudiandae nemo?",
        "image": One
    },
    {
        "title": "Itachi spunning",
        "description": "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos cupiditate autem et iste, ut laudantium soluta quidem ad beatae. Eum ducimus nostrum eligendi culpa fuga aliquid unde ipsa repudiandae nemo?",
        "image": "https://i.pinimg.com/736x/9d/11/17/9d11171c607a590faad058c611c6358d.jpg"
    },
    {
        "title": "Girrafe shortening",
        "description": "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos cupiditate autem et iste, ut laudantium soluta quidem ad beatae. Eum ducimus nostrum eligendi culpa fuga aliquid unde ipsa repudiandae nemo?",
        "image": "https://i.pinimg.com/736x/9b/2c/72/9b2c728067404e7a43ebffc6e6e2231c.jpg"
    },
    {
        "title": "Dolphin save",
        "description": "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos cupiditate autem et iste, ut laudantium soluta quidem ad beatae. Eum ducimus nostrum eligendi culpa fuga aliquid unde ipsa repudiandae nemo?",
        "image": "https://i.pinimg.com/736x/63/31/7d/63317d3a1a338af648ffc112c6ea9eb8.jpg"
    },
    {
        "title": "Phone gooo.",
        "description": "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos cupiditate autem et iste, ut laudantium soluta quidem ad beatae. Eum ducimus nostrum eligendi culpa fuga aliquid unde ipsa repudiandae nemo?",
        "image": "https://i.pinimg.com/736x/90/51/da/9051da02fbce1fcbcb3d274ea7b65ae2.jpg"
    }
]

const Home = () => {
    const client = useSuiClient()
    const dashboardID = useNetworkVariable("crowdfundingDashboard")

    function getDashboardFields(data: SuiObjectData | null | undefined) {
        if (data == null || data == undefined) return null;
        if (data.content?.dataType != "moveObject") return null;

        return data.content.fields as {
            id: any,
            campaigns: string[]
        };
    }

    const { data: data, isPending } = useSuiClientQuery(
        "getObject", {
            id: dashboardID,
            options: {
                showContent: true
            }
        }
    )

    return (
        <>
            <section className='py-6'>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4 py-2'>
                    {isPending ? (
                        <div className='px-6'>Loading...</div>
                    ): (
                        <>
                            {getDashboardFields(data?.data)?.campaigns.map((campaign, idx) => (
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