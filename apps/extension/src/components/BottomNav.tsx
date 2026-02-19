import { Home, Search, Settings } from "lucide-react"

export const BottomNav = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ]

  return (
    <nav className="p-4 bg-lingo-dark/80 backdrop-blur-md border-t border-lingo-border sticky bottom-0 z-20">
      <div className="flex justify-around items-center bg-white/5 rounded-2xl p-1 border border-white/5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center py-2 px-1 rounded-xl transition-all duration-200 ${isActive ? 'bg-white/10 text-lingo-green' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Icon size={20} className={isActive ? 'drop-shadow-lg' : ''} />
              {isActive && <span className="text-[10px] font-medium mt-1">{tab.label}</span>}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
