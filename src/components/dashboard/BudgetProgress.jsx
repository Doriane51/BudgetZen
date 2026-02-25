import { Link } from 'react-router-dom'
import useStore from '../../store/useStore'
import { getCategoryById } from '../../utils/categories'

const formatAmount = (amount) =>
  new Intl.NumberFormat('fr-FR').format(amount)

export default function BudgetProgress() {
  const { budgets, getMonthExpenses, activeMonth } = useStore()
  const expenses = getMonthExpenses()

  // Budgets du mois actif uniquement
  const monthBudgets = budgets.filter((b) => b.month === activeMonth)

  if (monthBudgets.length === 0) {
    return (
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold">Budget du mois</h2>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 py-8">
          <span className="text-4xl">◎</span>
          <p className="text-sm text-slate-500">Aucun budget défini</p>
          <Link
            to="/budget"
            className="text-xs text-indigo-400 hover:text-indigo-300 mt-1 transition-colors"
          >
            Créer un budget →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#111827] border border-white/5 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold">Budget du mois</h2>
        <Link
          to="/budget"
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Gérer →
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {monthBudgets.map((budget) => {
          const cat = getCategoryById(budget.category)

          // Total dépensé pour cette catégorie ce mois
          const spent = expenses
            .filter((t) => t.category === budget.category)
            .reduce((sum, t) => sum + t.amount, 0)

          const pct      = Math.min((spent / budget.limit) * 100, 100)
          const exceeded = spent > budget.limit

          // Couleur selon le pourcentage
          const barColor = exceeded
            ? '#f87171'
            : pct >= 80
            ? '#fbbf24'
            : '#34d399'

          return (
            <div key={budget.id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{cat.emoji}</span>
                  <span className="text-sm font-medium">{cat.label}</span>
                </div>
                <span
                  className="text-xs font-mono font-semibold"
                  style={{ color: barColor }}
                >
                  {exceeded ? '⚠ Dépassé' : `${Math.round(pct)}%`}
                </span>
              </div>

              {/* Barre */}
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-1">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: barColor }}
                />
              </div>

              {/* Montants */}
              <div className="flex justify-between text-xs text-slate-500">
                <span>{formatAmount(spent)} dépensé</span>
                <span>/ {formatAmount(budget.limit)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}