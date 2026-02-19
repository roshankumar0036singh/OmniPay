interface NavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav = ({ activeTab, setActiveTab }: NavProps) => (
  <nav className="bg-white border-t border-gray-200 grid grid-cols-3 p-1">
    {['home', 'search', 'settings'].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`flex flex-col items-center justify-center p-2 rounded-lg transition ${activeTab === tab ? "text-blue-600 bg-blue-50" : "text-gray-400 hover:text-gray-600"}`}
      >
        <span className="text-xs font-medium mt-1 capitalize">{tab}</span>
      </button>
    ))}
  </nav>
)
