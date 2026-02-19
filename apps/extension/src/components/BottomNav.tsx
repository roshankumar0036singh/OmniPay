interface NavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav = ({ activeTab, setActiveTab }: NavProps) => (
  <nav className="bg-dark-bg border-t border-dark-border grid grid-cols-3 p-1">
    {['home', 'search', 'settings'].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`flex flex-col items-center justify-center p-2 rounded-lg transition duration-200 ${activeTab === tab ? "text-black bg-neon shadow-[0_0_8px_rgba(204,255,0,0.5)]" : "text-gray-500 hover:text-white hover:bg-white/5"}`}
      >
        <span className="text-xs font-bold mt-1 capitalize">{tab}</span>
      </button>
    ))}
  </nav>
)
