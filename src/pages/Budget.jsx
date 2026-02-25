import { useState } from 'react'
import useStore from '../store/useStore'
import { getCategoryById } from '../utils/categories'
import BudgetForm from '../components/budget/BudgetForm'

const formatAmount = (amount) =>
  new Intl.NumberFormat('fr-FR').format(amount)

export default function Budget() {
  const { budgets, deleteBudget, getMonthExpenses, activeMonth } = useStore()
  const [showForm, setShowForm] = useState(false)

  const expenses      = getMonthExpenses()
  const monthBudgets  = budgets.filter((b) => b.month === activeMonth)

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Budgets du mois</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {monthBudgets.length} budget{monthBudgets.length > 1 ? 's' : ''} défini{monthBudgets.length > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-500/25"
        >
          ＋ Nouveau budget
        </button>
      </div>

      {/* Etat vide */}
      {monthBudgets.length === 0 && (
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-12 flex flex-col items-center gap-3">
          <span className="text-5xl">◎</span>
          <p className="text-slate-400 font-medium">Aucun budget ce mois-ci</p>
          <p className="text-slate-500 text-sm text-center max-w-xs">
            Définis des plafonds par catégorie pour mieux contrôler tes dépenses
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            Créer mon premier budget →
          </button>
        </div>
      )}

      {/* Grille de budgets */}
      {monthBudgets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {monthBudgets.map((budget) => {
            const cat = getCategoryById(budget.category)

            const spent = expenses
              .filter((t) => t.category === budget.category)
              .reduce((sum, t) => sum + t.amount, 0)

            const pct      = (spent / budget.limit) * 100
            const exceeded = spent > budget.limit

            const barColor = exceeded
              ? '#f87171'
              : pct >= 80
              ? '#fbbf24'
              : '#34d399'

            const statusLabel = exceeded
              ? '⚠ Dépassé'
              : pct >= 80
              ? '⚠ Attention'
              : '✓ OK'

            const statusStyle = exceeded
              ? 'bg-red-500/15 text-red-400'
              : pct >= 80
              ? 'bg-amber-500/15 text-amber-400'
              : 'bg-emerald-500/15 text-emerald-400'

            return (
              <div
                key={budget.id}
                className="bg-[#111827] border border-white/5 rounded-2xl p-5 hover:-translate-y-0.5 transition-transform group"
              >
                {/* Card header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ backgroundColor: cat.bgColor }}
                    >
                      {cat.emoji}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{cat.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">Mensuel</div>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle}`}>
                    {statusLabel}
                  </span>
                </div>

                {/* Montants */}
                <div className="flex justify-between mb-2">
                  <span className="font-mono text-sm font-medium text-slate-200">
                    {formatAmount(spent)}
                  </span>
                  <span className="font-mono text-sm text-slate-500">
                    / {formatAmount(budget.limit)}
                  </span>
                </div>

                {/* Barre */}
                <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(pct, 100)}%`,
                      backgroundColor: barColor,
                    }}
                  />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {exceeded
                      ? `${formatAmount(spent - budget.limit)} dépassé`
                      : `${formatAmount(budget.limit - spent)} restants`
                    }
                  </span>

                  {/* Bouton supprimer */}
                  <button
                    onClick={() => deleteBudget(budget.id)}
                    className="opacity-0 group-hover:opacity-100 text-xs text-red-400 hover:text-red-300 transition-all"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            )
          })}

          {/* Carte ajouter */}
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#111827] border border-dashed border-white/10 hover:border-indigo-500/50 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-indigo-400 transition-all min-h-40"
          >
            <span className="text-3xl">＋</span>
            <span className="text-sm font-medium">Ajouter un budget</span>
          </button>
        </div>
      )}

      {/* Modal formulaire */}
      <BudgetForm open={showForm} onClose={() => setShowForm(false)} />
    </div>
  )
}