import { Home, Search, Settings, MessageSquare, ShoppingBag } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslation } from "../hooks/useTranslation"
import { cn } from "../utils/cn"

export const BottomNav = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const { t } = useTranslation();

  const tabs = [
    { id: 'home', icon: Home, label: t('nav.home') },
    { id: 'search', icon: Search, label: t('nav.search') },
    { id: 'cart', icon: ShoppingBag, label: t('nav.cart') }, // Added Cart
    { id: 'support', icon: MessageSquare, label: t('nav.support') },
    { id: 'settings', icon: Settings, label: t('nav.settings') }
  ]

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-50">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel rounded-full p-2 flex items-center justify-between shadow-glass border-white/20"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex-1 flex flex-col items-center justify-center h-12 rounded-full transition-all duration-300 group"
            >
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="absolute inset-0 bg-white/10 rounded-full shadow-inner border border-white/10"
                  />
                )}
              </AnimatePresence>

              <div className={cn(
                "relative z-10 transition-all duration-300",
                isActive ? "text-neon scale-110" : "text-gray-500 group-hover:text-gray-300"
              )}>
                <Icon size={isActive ? 20 : 18} />
                {isActive && (
                  <motion.div
                    layoutId="active-dot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-neon rounded-full shadow-neon"
                  />
                )}
              </div>
            </button>
          )
        })}
      </motion.div>
    </nav>
  )
}

import { AnimatePresence } from "framer-motion"

