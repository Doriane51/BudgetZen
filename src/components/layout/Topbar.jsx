import { useLocation } from 'react-router-dom'
import useStore from '../../store/useStore'

const pageTitles = {
  '/':             { title: 'Tableau de bord', sub: 'Vue d\'ensemble'    },
  '/transactions': { title: 'Transactions',    sub: 'Historique complet' },
  '/budget':       { title: 'Budgets',         sub: 'Suivi par catégorie'},
  '/epargne':      { title: 'Épargne',         sub: 'Objectifs en cours' },
  '/rapports':     { title: 'Rapports',        sub: 'Analyse détaillée'  },
}

const months = [
  '2026-01', '2026-02', '2026-03', '2026-04',
  '2026-05', '2026-06', '2026-07', '2026-08',
  '2026-09', '2026-10', '2026-11', '2026-12',
]

const formatMonth = (ym) => {
  const [year, month] = ym.split('-')
  return new Date(year, month - 1).toLocaleDateString('fr-FR', {
    month: 'long', year: 'numeric'
  })
}

export default function Topbar({ onAdd, onMenuOpen }) {
  const location = useLocation()
  const page = pageTitles[location.pathname] ?? pageTitles['/']
  const { activeMonth, setActiveMonth } = useStore()

  const prev = () => {
    const idx = months.indexOf(activeMonth)
    if (idx > 0) setActiveMonth(months[idx - 1])
  }

  const next = () => {
    const idx = months.indexOf(activeMonth)
    if (idx < months.length - 1) setActiveMonth(months[idx + 1])
  }

  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-4 md:py-5 bg-[#111827] border-b border-white/5 gap-3">

      <div className="flex items-center gap-3">
        {/* Bouton hamburger — mobile uniquement */}
        <button
          onClick={onMenuOpen}
          className="lg:hidden text-slate-400 hover:text-white text-xl p-1"
        >
          ☰
        </button>

        {/* Titre */}
        <div>
          <h1 className="text-base md:text-lg font-bold tracking-tight">{page.title}</h1>
          <p className="text-xs text-slate-500 mt-0.5 capitalize hidden sm:block">
            {page.sub} · {formatMonth(activeMonth)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 md:gap-3">

        {/* Sélecteur de mois — caché sur très petit écran */}
        <div className="hidden sm:flex items-center gap-2 bg-[#1a2235] border border-white/5 rounded-xl px-3 md:px-4 py-2 text-sm font-medium">
          <button onClick={prev} className="text-slate-400 hover:text-white transition-colors">◀</button>
          <span className="capitalize w-28 md:w-32 text-center text-xs md:text-sm">
            {formatMonth(activeMonth)}
          </span>
          <button onClick={next} className="text-slate-400 hover:text-white transition-colors">▶</button>
        </div>

        {/* Bouton ajouter */}
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-400 text-white text-xs md:text-sm font-semibold px-3 md:px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-500/25 whitespace-nowrap"
        >
          <span>＋</span>
          <span className="hidden sm:inline">Nouvelle transaction</span>
          <span className="sm:hidden">Ajouter</span>
        </button>

      </div>
    </header>
  )
}