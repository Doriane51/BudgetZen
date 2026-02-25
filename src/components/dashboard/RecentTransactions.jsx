import { Link } from 'react-router-dom'
import useStore from '../../store/useStore'
import { getCategoryById } from '../../utils/categories'

const formatAmount = (amount) =>
  new Intl.NumberFormat('fr-FR').format(amount)

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const today = new Date()
  const isToday = date.toDateString() === today.toDateString()
  if (isToday) return "Aujourd'hui"
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export default function RecentTransactions() {
  const { getMonthTransactions } = useStore()
  const transactions = getMonthTransactions().slice(0, 5)

  if (transactions.length === 0) {
    return (
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold">Dernières transactions</h2>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 py-8">
          <span className="text-4xl">💸</span>
          <p className="text-sm text-slate-500">Aucune transaction ce mois-ci</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#111827] border border-white/5 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold">Dernières transactions</h2>
        <Link
          to="/transactions"
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Voir tout →
        </Link>
      </div>

      <div className="flex flex-col gap-1">
        {transactions.map((tx) => {
          const cat = tx.type === 'income'
            ? { emoji: '💼', color: '#34d399', bgColor: 'rgba(52,211,153,0.12)', label: 'Revenu' }
            : getCategoryById(tx.category)

          return (
            <div
              key={tx.id}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors"
            >
              {/* Icône */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                style={{ backgroundColor: cat.bgColor }}
              >
                {cat.emoji}
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{tx.description}</div>
                <div className="text-xs text-slate-500 mt-0.5">{cat.label}</div>
              </div>

              {/* Montant + date */}
              <div className="text-right shrink-0">
                <div className={`font-mono text-sm font-medium ${
                  tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {tx.type === 'income' ? '+' : '-'}{formatAmount(tx.amount)}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {formatDate(tx.date)}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}