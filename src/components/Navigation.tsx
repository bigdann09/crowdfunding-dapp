import { ConnectButton } from "@mysten/dapp-kit"
import { Link } from "react-router-dom"
import { BiPlus } from "react-icons/bi"

const Navigation = () => {
    return (
        <nav className='flex items-center justify-between px-3 py-5'>
            <Link to="/" className='text-xl font-bold relative before:absolute before:bottom-[2px] before:left-0 before:h-1 before:w-full before:bg-sky-700'>SUIFUND</Link>
            {/* search bar */}
            <div></div>

            {/* create campaign and connect button */}
            <div className='flex items-center gap-x-5'>
                <Link to={"/create"} className="bg-sky-700 text-white flex justify-center items-center group/modal-btn py-[.6rem] px-2 rounded-md font-bold">
                    <BiPlus className='w-5 h-5' />
                    <span>Create Campaign</span>
                </Link>
                <ConnectButton />
            </div>
        </nav>
    )
}

export default Navigation