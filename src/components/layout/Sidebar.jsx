import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/',             emoji: '⬡', label: 'Tableau de bord' },
  { to: '/transactions', emoji: '↕', label: 'Transactions'    },
  { to: '/budget',       emoji: '◎', label: 'Budgets'         },
  { to: '/epargne',      emoji: '◇', label: 'Épargne'         },
  { to: '/rapports',     emoji: '⊞', label: 'Rapports'        },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Fond sombre sur mobile quand menu ouvert */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-30 w-60 bg-[#111827] border-r border-white/5
        flex flex-col py-7 transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:static lg:translate-x-0 lg:min-w-60
      `}>

        {/* Logo */}
        <div className="flex items-center justify-between px-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center text-lg shadow-lg shadow-indigo-500/30">
              💎
            </div>
            <span className="font-bold text-base tracking-tight">
              Budget<span className="text-indigo-400">Zen</span>
            </span>
          </div>

          {/* Bouton fermer — mobile uniquement */}
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 px-3 mb-2">
            Menu
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all
                ${isActive
                  ? 'bg-indigo-500/15 text-indigo-400'
                  : 'text-slate-400 hover:bg-[#1a2235] hover:text-slate-200'
                }`
              }
            >
              <span className="w-5 text-center">{item.emoji}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Utilisateur */}
        <div className="px-6 pt-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#1a2235] cursor-pointer transition-all">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-violet-400 flex items-center justify-center text-xs font-bold">
              DN
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">Doriane NOUVIVI</div>
              <div className="text-xs text-slate-500">Plan gratuit</div>
            </div>
            <span className="text-slate-500 text-sm">⚙</span>
          </div>
        </div>

      </aside>
    </>
  )
}