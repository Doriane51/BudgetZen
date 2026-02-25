import { useState, useMemo } from 'react'
import useStore from '../store/useStore'
import { categories } from '../utils/categories'
import TransactionList from '../components/transactions/TransactionList'

const formatAmount = (amount) =>
  new Intl.NumberFormat('fr-FR').format(amount)

export default function Transactions() {
  const { getMonthTransactions, deleteTransaction } = useStore()
  const transactions = getMonthTransactions()

  const [search,      setSearch]      = useState('')
  const [filterType,  setFilterType]  = useState('all')
  const [filterCat,   setFilterCat]   = useState('all')

  // Filtrage
  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const matchSearch = tx.description
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchType = filterType === 'all' || tx.type === filterType
      const matchCat  = filterCat  === 'all' || tx.category === filterCat
      return matchSearch && matchType && matchCat
    })
  }, [transactions, search, filterType, filterCat])

  // Totaux des transactions filtrées
  const totalIncome  = filtered
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0)

  const totalExpense = filtered
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0)

  return (
    <div className="flex flex-col gap-5">

      {/* Résumé rapide */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-4">
          <div className="text-xs text-slate-500 mb-1">Transactions</div>
          <div className="font-mono text-lg font-medium text-slate-200">
            {filtered.length}
          </div>
        </div>
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-4">
          <div className="text-xs text-slate-500 mb-1">Revenus</div>
          <div className="font-mono text-lg font-medium text-emerald-400">
            +{formatAmount(totalIncome)}
          </div>
        </div>
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-4">
          <div className="text-xs text-slate-500 mb-1">Dépenses</div>
          <div className="font-mono text-lg font-medium text-red-400">
            -{formatAmount(totalExpense)}
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-4 flex flex-col gap-3">

        {/* Recherche */}
        <input
          type="text"
          placeholder="🔍  Rechercher une transaction..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#1a2235] border border-white/5 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-slate-600"
        />

        {/* Chips type */}
        <div className="flex gap-2 flex-wrap">
          {[
            { value: 'all',     label: 'Tous'     },
            { value: 'income',  label: '↑ Revenus' },
            { value: 'expense', label: '↓ Dépenses'},
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilterType(f.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                filterType === f.value
                  ? 'bg-indigo-500/15 border-indigo-500/50 text-indigo-400'
                  : 'bg-transparent border-white/10 text-slate-400 hover:border-white/20'
              }`}
            >
              {f.label}
            </button>
          ))}

          <div className="w-px bg-white/10 mx-1" />

          {/* Chips catégories */}
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                setFilterCat(filterCat === cat.id ? 'all' : cat.id)
              }
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                filterCat === cat.id
                  ? 'border-indigo-500/50 text-indigo-400'
                  : 'bg-transparent border-white/10 text-slate-400 hover:border-white/20'
              }`}
              style={filterCat === cat.id
                ? { backgroundColor: cat.bgColor }
                : {}
              }
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Liste */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-2">
        <TransactionList
          transactions={filtered}
          onDelete={deleteTransaction}
        />
      </div>

    </div>
  )
}