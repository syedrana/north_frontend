import { Menu } from "lucide-react";

export default function Topbar({ onMenu }) {
  return (
    <header className="sticky top-0 z-30 h-14 bg-white/90 backdrop-blur border-b flex items-center px-4 sm:px-6">
      <button onClick={onMenu} className="lg:hidden mr-3">
        <Menu size={20} />
      </button>

      <div className="flex-1 text-sm font-medium text-slate-700">
        Admin Panel
      </div>

      <div className="text-sm text-slate-500">Syed Rana</div>
    </header>
  );
}
