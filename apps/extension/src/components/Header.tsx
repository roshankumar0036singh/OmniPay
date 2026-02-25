import { motion } from "framer-motion"
import { Bell, User, Settings, Search } from "lucide-react"
import { LingoChip } from "./LingoChip"
import { PremiumButton } from "./PremiumButton"

export const Header = () => (
    <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between px-5 py-4 bg-lingo-dark/40 backdrop-blur-2xl border-b border-white/5 z-20 sticky top-0 shadow-glass"
    >
        <div className="flex items-center gap-3 group cursor-pointer relative">
            <LingoChip className="w-11 h-9" />
            <div className="flex flex-col">
                <h1 className="text-base font-black text-white leading-none tracking-tighter group-hover:text-neon transition-colors italic uppercase">OmniPay</h1>
                <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 bg-neon rounded-full animate-pulse shadow-neon" />
                    <span className="text-[8px] text-neon/70 font-black tracking-[0.2em] uppercase">Global Intel</span>
                </div>
            </div>
            {/* Hover Decor */}
            <div className="absolute inset-0 bg-neon/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
        </div>

        <div className="flex items-center gap-2">
            <PremiumButton variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-white/5">
                <Bell size={18} className="text-gray-400 group-hover:text-white" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-neon rounded-full border-2 border-lingo-dark shadow-neon" />
            </PremiumButton>

            <div className="w-[1px] h-6 bg-white/5 mx-1" />

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group"
            >
                <div className="w-7 h-7 rounded-xl bg-neon flex items-center justify-center text-black font-black text-[10px] shadow-neon">
                    OP
                </div>
                <span className="text-[10px] font-bold text-gray-400 group-hover:text-white">Admin</span>
            </motion.button>
        </div>
    </motion.header>
)

