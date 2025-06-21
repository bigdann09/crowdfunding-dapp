import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import One from '../assets/one.jpeg'

const Campaign = () => {
    const donors = [
        {
            address: "0x939393920029293939393",
            amount: 10000,
            date: '2022-02-01',
        },
        {
            address: "0x339949393920029293939393",
            amount: 400,
            date: '2022-02-01',
        }
    ]
    return (
        <main>
            <section className='w-full relative py-3 mt-4 grid lg:grid-cols-[75%_25%] px-2'>
                <div className='bg-green-700 h-[18rem] rounded-md relative before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gray-700/20 before:rounded-md'>
                    <img src={One} alt={"ddd"} className='w-full h-full object-cover rounded-md' />
                </div>
                <div className='w-full flex flex-row md:flex-col items-center justify-center py-4 gap-x-3 gap-y-3'>
                    <div className='w-[33.3%] md:w-[70%] bg-gray-800 shadow-sm rounded-md py-1'>
                        <h2 className='font-bold text-lg text-center bg-gray-900'>Days Left</h2>
                        <p className='text-[1.9rem] text-center py-1'>3</p>
                    </div>
                    <div className='w-[33.3%] md:w-[70%] bg-gray-800 shadow-sm rounded-md py-1'>
                        <h2 className='font-bold text-lg text-center bg-gray-900'>Target</h2>
                        <p className='text-3xl text-center py-2'>200000 sui</p>
                    </div>
                    <div className='w-[33.3%] md:w-[70%] bg-gray-800 shadow-sm rounded-md py-1'>
                        <h2 className='font-bold text-lg text-center bg-gray-900'>Raised</h2>
                        <p className='text-3xl text-center py-2'>1000 sui</p>
                    </div>
                </div>
            </section>
            <section className='grid grid-cols-[66%_30%] items-start gap-x-4 px-3 pb-12'>
                <div className='py-2 space-y-4'>
                    <div>
                        <h4 className='text-lg font-bold'>Creator:</h4>
                        <div className='flex items-center  gap-x-2 mt-2'>
                            <div className='w-[2rem] h-[2rem] rounded-full bg-red-400'></div>
                            <p className='text-lg'>0xueureu399393udjdjmdmmdjii393893848484839</p>
                        </div>
                    </div>
                    <div>
                        <h4 className='text-lg font-bold'>Description:</h4>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis nemo voluptatum impedit dignissimos, eaque cumque autem adipisci illum explicabo molestias consectetur amet earum iusto. Repellendus atque veniam quo qui tempore! Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic vel libero praesentium reiciendis eius a rem? Dicta optio incidunt adipisci accusantium, reprehenderit tempore voluptates error reiciendis tempora. Explicabo, obcaecati quod.</p>
                    </div>
                    <div className='py-5 bg-neutral-900 px-2 rounded-md shadow-sm'>
                        <Table>
                            <TableCaption>A list of donors.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Address</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {donors.map((donor, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell className="font-medium">{donor.address}</TableCell>
                                        <TableCell>{donor.amount}</TableCell>
                                        <TableCell>{donor.date}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <div className='bg-gray-800 shadow-md border border-gray-900 rounded-md p-3 px-4 mt-6'>
                    <form>
                        <div className='flex flex-col space-y-1'>
                            <label htmlFor="title">Amount</label>
                            <input type='number' name='title' className='h-[2.5rem] rounded-md px-2 outline-none' placeholder='0.0 SUI' />
                        </div>
                        <div className='mt-4'>
                            <button type='button' className='w-full h-[3rem] bg-sky-800 rounded-md outline-none hover:scale-[1.05] duration-300'>Fund Campaign</button>
                        </div>
                    </form>
                </div>
            </section >
        </main >
    )
}

export default Campaign