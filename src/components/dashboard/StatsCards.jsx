import useStore from '../../store/useStore'

const formatAmount = (amount) =>
  new Intl.NumberFormat('fr-FR').format(amount)

export default function StatsCards() {
  const { getTotalIncomes, getTotalExpenses, getBalance } = useStore()

  const balance  = getBalance()
  const incomes  = getTotalIncomes()
  const expenses = getTotalExpenses()
  const rate     = incomes > 0 ? ((balance / incomes) * 100).toFixed(1) : 0

  const cards = [
    {
      label: 'Solde du mois',
      value: formatAmount(balance),
      trend: `Taux d'épargne ${rate}%`,
      emoji: '💎',
      color: 'text-indigo-400',
      bg:    'bg-indigo-500/10',
      border:'border-indigo-500/20',
    },
    {
      label: 'Total revenus',
      value: formatAmount(incomes),
      trend: 'Ce mois-ci',
      emoji: '↑',
      color: 'text-emerald-400',
      bg:    'bg-emerald-500/10',
      border:'border-emerald-500/20',
    },
    {
      label: 'Total dépenses',
      value: formatAmount(expenses),
      trend: 'Ce mois-ci',
      emoji: '↓',
      color: 'text-red-400',
      bg:    'bg-red-500/10',
      border:'border-red-500/20',
    },
    {
      label: 'Épargne nette',
      value: formatAmount(balance > 0 ? balance : 0),
      trend: 'Disponible',
      emoji: '◇',
      color: 'text-amber-400',
      bg:    'bg-amber-500/10',
      border:'border-amber-500/20',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`${card.bg} border ${card.border} rounded-2xl p-4 md:p-5 relative overflow-hidden`}
        >
          {/* Icône */}
          <div className={`text-xl md:text-2xl absolute top-4 right-4 opacity-60`}>
            {card.emoji}
          </div>

          {/* Contenu */}
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            {card.label}
          </div>

          <div className={`font-mono text-lg md:text-2xl font-medium ${card.color} mb-1`}>
            {card.value}
          </div>

          <div className="text-xs text-slate-500">
            FCFA · {card.trend}
          </div>
        </div>
      ))}
    </div>
  )
}