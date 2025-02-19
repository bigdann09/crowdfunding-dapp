import {
    Modal,
    ModalBody,
    ModalContent,
    ModalTrigger,
} from "./ui/animated-modal";
import { BiPlus } from 'react-icons/bi'

export function AnimatedModal() {
    return (
        <div className="flex items-center justify-center modal">
            <Modal>
                <ModalTrigger className="bg-sky-700 text-black  flex justify-center group/modal-btn">
                    <span className="text-center transition duration-500 flex items-center gap-x-1">
                        <BiPlus className='w-5 h-5' />
                        <span>Create Campaign</span>
                    </span>
                </ModalTrigger>
                <ModalBody className='h-auto overflow-y-scroll modal'>
                    <ModalContent>
                        <h4 className="text-lg md:text-xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-3">Create A Crowdfund Campaign</h4>

                        <div>
                            {/* form */}
                            <form action="" className='space-y-2'>
                                <div className="space-y-1">
                                    <label htmlFor="title" className='text-[1.1rem]'>Title</label>
                                    <input type="text" name="title" className='w-full h-[3rem] rounded-md px-2' />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="title" className='text-[1.1rem]'>Target Amount</label>
                                    <input type="number" name="title" className='w-full h-[3rem] rounded-md px-2' />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="title" className='text-[1.1rem]'>End Date</label>
                                    <input type="date" name="title" className='w-full h-[3rem] rounded-md px-2' />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="description" className='text-[1.1rem]'>Description/Story</label>
                                    <textarea name="description" id="" className='block w-full resize-none h-[7rem] rounded-md'></textarea>
                                </div>
                                <div>
                                    <button className='w-full py-2 px-4 rounded-md bg-sky-800'>Create Campaign</button>
                                </div>
                            </form>
                        </div>
                    </ModalContent>
                </ModalBody>
            </Modal>
        </div>
    );
}

