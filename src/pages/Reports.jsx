import { useMemo } from 'react'
import useStore from '../store/useStore'
import { categories, getCategoryById } from '../utils/categories'

const formatAmount = (amount) =>
  new Intl.NumberFormat('fr-FR').format(amount)

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

// Export CSV
const exportCSV = (transactions) => {
  const header = ['Date', 'Description', 'Catégorie', 'Type', 'Montant (FCFA)']
  const rows   = transactions.map((t) => [
    t.date,
    t.description,
    t.type === 'income' ? 'Revenu' : getCategoryById(t.category).label,
    t.type === 'income' ? 'Revenu' : 'Dépense',
    t.amount,
  ])

  const csv     = [header, ...rows].map((r) => r.join(';')).join('\n')
  const blob    = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url     = URL.createObjectURL(blob)
  const link    = document.createElement('a')
  link.href     = url
  link.download = `budgetzen-export.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export default function Reports() {
  const { getMonthTransactions, getTotalIncomes, getTotalExpenses, getBalance, activeMonth } = useStore()
  const transactions = getMonthTransactions()

  const totalIncomes  = getTotalIncomes()
  const totalExpenses = getTotalExpenses()
  const balance       = getBalance()
  const savingsRate   = totalIncomes > 0
    ? ((balance / totalIncomes) * 100).toFixed(1)
    : 0

  // Totaux par catégorie
  const categoryTotals = useMemo(() => {
    return categories.map((cat) => {
      const txs   = transactions.filter((t) => t.category === cat.id && t.type === 'expense')
      const total = txs.reduce((s, t) => s + t.amount, 0)
      const pct   = totalExpenses > 0 ? ((total / totalExpenses) * 100).toFixed(1) : 0
      return { ...cat, total, count: txs.length, pct }
    }).filter((c) => c.total > 0)
      .sort((a, b) => b.total - a.total)
  }, [transactions, totalExpenses])

  // Mois formaté
  const monthLabel = new Date(activeMonth + '-01').toLocaleDateString('fr-FR', {
    month: 'long', year: 'numeric'
  })

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold capitalize">{monthLabel}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {transactions.length} transaction{transactions.length > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => exportCSV(transactions)}
          disabled={transactions.length === 0}
          className="flex items-center gap-2 bg-[#111827] border border-white/5 hover:border-emerald-500/50 hover:text-emerald-400 text-slate-300 text-sm font-medium px-4 py-2 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ⬇ Exporter CSV
        </button>
      </div>

      {/* Etat vide */}
      {transactions.length === 0 && (
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-12 flex flex-col items-center gap-3">
          <span className="text-5xl">⊞</span>
          <p className="text-slate-400 font-medium">Aucune donnée ce mois-ci</p>
          <p className="text-slate-500 text-sm">Ajoute des transactions pour voir apparaître ton rapport</p>
        </div>
      )}

      {transactions.length > 0 && (
        <>
          {/* Cartes résumé */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-[#111827] border border-indigo-500/20 rounded-2xl p-4">
              <div className="text-xs text-slate-500 mb-1">Solde net</div>
              <div className="font-mono text-lg font-medium text-indigo-400">
                {formatAmount(balance)}
              </div>
              <div className="text-xs text-slate-600 mt-0.5">FCFA</div>
            </div>
            <div className="bg-[#111827] border border-emerald-500/20 rounded-2xl p-4">
              <div className="text-xs text-slate-500 mb-1">Revenus</div>
              <div className="font-mono text-lg font-medium text-emerald-400">
                {formatAmount(totalIncomes)}
              </div>
              <div className="text-xs text-slate-600 mt-0.5">FCFA</div>
            </div>
            <div className="bg-[#111827] border border-red-500/20 rounded-2xl p-4">
              <div className="text-xs text-slate-500 mb-1">Dépenses</div>
              <div className="font-mono text-lg font-medium text-red-400">
                {formatAmount(totalExpenses)}
              </div>
              <div className="text-xs text-slate-600 mt-0.5">FCFA</div>
            </div>
            <div className="bg-[#111827] border border-amber-500/20 rounded-2xl p-4">
              <div className="text-xs text-slate-500 mb-1">Taux d'épargne</div>
              <div className="font-mono text-lg font-medium text-amber-400">
                {savingsRate}%
              </div>
              <div className="text-xs text-slate-600 mt-0.5">du revenu total</div>
            </div>
          </div>

          {/* Rapport par catégorie */}
          {categoryTotals.length > 0 && (
            <div className="bg-[#111827] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-semibold mb-4">Dépenses par catégorie</h3>
              <div className="flex flex-col gap-3">
                {categoryTotals.map((cat) => (
                  <div key={cat.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span>{cat.emoji}</span>
                        <span className="text-sm text-slate-300">{cat.label}</span>
                        <span className="text-xs text-slate-500">
                          {cat.count} tx
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500">{cat.pct}%</span>
                        <span className="font-mono text-sm font-medium text-slate-200 w-28 text-right">
                          {formatAmount(cat.total)} FCFA
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${cat.pct}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tableau toutes transactions */}
          <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/5">
              <h3 className="text-sm font-semibold">Toutes les transactions</h3>
            </div>

            {/* Header tableau — caché sur mobile */}
            <div className="hidden sm:grid grid-cols-4 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-white/5">
              <div>Description</div>
              <div>Catégorie</div>
              <div>Date</div>
              <div className="text-right">Montant</div>
            </div>

            {/* Lignes */}
            <div className="divide-y divide-white/5">
              {transactions.map((tx) => {
                const cat = tx.type === 'income'
                  ? { emoji: '💼', label: 'Revenu', color: '#34d399', bgColor: 'rgba(52,211,153,0.12)' }
                  : getCategoryById(tx.category)

                return (
                  <div key={tx.id} className="grid grid-cols-2 sm:grid-cols-4 px-5 py-3.5 hover:bg-white/5 transition-colors items-center">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0"
                        style={{ backgroundColor: cat.bgColor }}
                      >
                        {cat.emoji}
                      </div>
                      <span className="text-sm truncate">{tx.description}</span>
                    </div>

                    <div className="hidden sm:block text-sm text-slate-400">
                      {cat.label}
                    </div>

                    <div className="hidden sm:block text-sm text-slate-400">
                      {formatDate(tx.date)}
                    </div>

                    <div className={`text-right font-mono text-sm font-medium ${
                      tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}{formatAmount(tx.amount)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

    </div>
  )
}