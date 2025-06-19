import { ConnectButton } from "@mysten/dapp-kit"
import { Link } from "react-router-dom"
import { AnimatedModal } from "./AnimatedModal"

const Navigation = () => {
    return (
        <nav className='flex items-center justify-between px-3 py-5'>
            <Link to="/" className='text-xl font-bold relative before:absolute before:bottom-[2px] before:left-0 before:h-1 before:w-full before:bg-sky-700'>SUIFUND</Link>
            {/* search bar */}
            <div></div>

            {/* create campaign and connect button */}
            <div className='flex items-center gap-x-5'>
                <AnimatedModal />
                <ConnectButton />
            </div>
        </nav>
    )
}

export default Navigation