interface NavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav = ({ activeTab, setActiveTab }: NavProps) => (
  <nav className="bg-black border-t-2 border-neon grid grid-cols-3 font-mono">
    {['home', 'search', 'settings'].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`flex flex-col items-center justify-center py-3 transition-all ${activeTab === tab ? "bg-neon text-black font-extrabold" : "text-neon hover:bg-neon/20"}`}
      >
        <div className={`text-[10px] uppercase tracking-widest ${activeTab === tab ? "" : "opacity-70"}`}>
          [{tab}]
        </div>
      </button>
    ))}
  </nav>
)
