export const Header = () => (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">O</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">OmniPay</h1>
        </div>
        <div className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
            Active
        </div>
    </header>
)
