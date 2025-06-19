import { useSuiClient } from "@mysten/dapp-kit";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalTrigger,
} from "./ui/animated-modal";
import { BiPlus } from 'react-icons/bi'
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "@/config/networkconfig";
import { useForm } from 'react-hook-form'
import { parseTime } from "@/lib/utils";

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { HTMLAttributes, useState } from "react";

const DateTimePicker = ({ className }: HTMLAttributes<HTMLDivElement>) => {
    const [date, setDate] = useState<DateRange | undefined>()

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

export function AnimatedModal() {
    const client = useSuiClient()
    const packageID = useNetworkVariable("crowdfundingPackageID")

    const { register, handleSubmit, formState: { errors } } = useForm();

    function createCampaign(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {

        // get data
        const date = new Date()
        let startTime = parseTime(date.getTime())
        let endTime = parseTime(date.getTime())
        const goal = 383939

        const tx = new Transaction()
        tx.moveCall({
            arguments: [
                tx.pure.u64(startTime),
                tx.pure.u64(endTime),
                tx.pure.u64(goal),
                tx.object.clock()
            ],
            target: `${packageID}::crowdfunding_contract::launch`
        })
    }


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
                                    <input
                                        type="text"
                                        className='w-full h-[3rem] rounded-md px-2'
                                        {...register('title')}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="title" className='text-[1.1rem]'>Target Amount</label>
                                    <input
                                        type="number"
                                        className='w-full h-[3rem] rounded-md px-2'
                                        {...register('number')}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="title" className='text-[1.1rem]'>End Date</label>
                                    {/* <input
                                        type="date"
                                        className='w-full h-[3rem] rounded-md px-2'
                                        {...register('date')}
                                    /> */}
                                    <DateTimePicker />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="description" className='text-[1.1rem]'>Description/Story</label>
                                    <textarea name="description" id="" className='block w-full resize-none h-[7rem] rounded-md'></textarea>
                                </div>
                                <div>
                                    <button
                                        onClick={createCampaign}
                                        className='w-full py-2 px-4 rounded-md bg-sky-800'>Create Campaign</button>
                                </div>
                            </form>
                        </div>
                    </ModalContent>
                </ModalBody>
            </Modal>
        </div>
    );
}

