//import useStore from '../../store/useStore'
import { getCategoryById } from '../../utils/categories'

const formatAmount = (amount) =>
  new Intl.NumberFormat('fr-FR').format(amount)

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

export default function TransactionList({ transactions, onDelete }) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16">
        <span className="text-5xl">💸</span>
        <p className="text-slate-400 font-medium">Aucune transaction trouvée</p>
        <p className="text-slate-500 text-sm">Essaie de changer les filtres</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      {transactions.map((tx) => {
        const cat = tx.type === 'income'
          ? { emoji: '💼', color: '#34d399', bgColor: 'rgba(52,211,153,0.12)', label: 'Revenu' }
          : getCategoryById(tx.category)

        return (
          <div
            key={tx.id}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group"
          >
            {/* Icône */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
              style={{ backgroundColor: cat.bgColor }}
            >
              {cat.emoji}
            </div>

            {/* Infos */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{tx.description}</div>
              <div className="text-xs text-slate-500 mt-0.5">
                {cat.label} · {formatDate(tx.date)}
              </div>
            </div>

            {/* Badge type — caché sur mobile */}
            <div className="hidden sm:block">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                tx.type === 'income'
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-red-500/15 text-red-400'
              }`}>
                {tx.type === 'income' ? 'Revenu' : 'Dépense'}
              </span>
            </div>

            {/* Montant */}
            <div className="text-right shrink-0">
              <div className={`font-mono text-sm font-semibold ${
                tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {tx.type === 'income' ? '+' : '-'}{formatAmount(tx.amount)}
              </div>
              <div className="text-xs text-slate-600">FCFA</div>
            </div>

            {/* Bouton supprimer */}
            <button
              onClick={() => onDelete(tx.id)}
              className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-400 flex items-center justify-center text-sm transition-all shrink-0"
            >
              ✕
            </button>
          </div>
        )
      })}
    </div>
  )
}