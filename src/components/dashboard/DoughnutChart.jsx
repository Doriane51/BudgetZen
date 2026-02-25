import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import useStore from '../../store/useStore'
import { categories } from '../../utils/categories'

ChartJS.register(ArcElement, Tooltip, Legend)

const formatAmount = (amount) =>
  new Intl.NumberFormat('fr-FR').format(amount)

export default function DoughnutChart() {
  const { getMonthExpenses } = useStore()
  const expenses = getMonthExpenses()

  // Calculer le total par catégorie
  const totals = categories.map((cat) => ({
    ...cat,
    total: expenses
      .filter((t) => t.category === cat.id)
      .reduce((sum, t) => sum + t.amount, 0),
  })).filter((cat) => cat.total > 0)

  const grandTotal = totals.reduce((sum, c) => sum + c.total, 0)

  const data = {
    labels: totals.map((c) => c.label),
    datasets: [
      {
        data: totals.map((c) => c.total),
        backgroundColor: totals.map((c) => c.color),
        borderColor: '#111827',
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a2235',
        borderColor: 'rgba(255,255,255,0.07)',
        borderWidth: 1,
        titleColor: '#e2e8f0',
        bodyColor: '#94a3b8',
        padding: 12,
        callbacks: {
          label: (ctx) =>
            ` ${formatAmount(ctx.raw)} FCFA`,
        },
      },
    },
  }

  // Etat vide
  if (totals.length === 0) {
    return (
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-5 flex flex-col">
        <h2 className="text-sm font-semibold mb-5">Dépenses par catégorie</h2>
        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-8">
          <span className="text-4xl">📊</span>
          <p className="text-sm text-slate-500">Aucune dépense ce mois-ci</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#111827] border border-white/5 rounded-2xl p-5 flex flex-col">
      <h2 className="text-sm font-semibold mb-5">Dépenses par catégorie</h2>

      {/* Graphique */}
      <div className="relative h-40 w-40 mx-auto mb-5">
        <Doughnut data={data} options={options} />
        {/* Total au centre */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-base font-medium text-slate-200">
            {formatAmount(grandTotal)}
          </span>
          <span className="text-xs text-slate-500">FCFA</span>
        </div>
      </div>

      {/* Légende */}
      <div className="flex flex-col gap-2.5">
        {totals.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-xs text-slate-400">{cat.label}</span>
            </div>
            <span className="font-mono text-xs font-medium text-slate-300">
              {formatAmount(cat.total)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}