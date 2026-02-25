import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'
import useStore from '../../store/useStore'

// Enregistrer les modules Chart.js qu'on utilise
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

// Retourne les 6 derniers mois à partir du mois actif
const getLast6Months = (activeMonth) => {
  const [year, month] = activeMonth.split('-').map(Number)
  const months = []

  for (let i = 5; i >= 0; i--) {
    let m = month - i
    let y = year
    if (m <= 0) { m += 12; y -= 1 }
    months.push(`${y}-${String(m).padStart(2, '0')}`)
  }

  return months
}

const formatMonthLabel = (ym) => {
  const [year, month] = ym.split('-')
  return new Date(year, month - 1).toLocaleDateString('fr-FR', { month: 'short' })
}

export default function BarChart() {
  const { transactions, activeMonth } = useStore()

  const last6 = getLast6Months(activeMonth)

  // Pour chaque mois, calculer revenus et dépenses
  const incomes  = last6.map((m) =>
    transactions
      .filter((t) => t.date.startsWith(m) && t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
  )

  const expenses = last6.map((m) =>
    transactions
      .filter((t) => t.date.startsWith(m) && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  )

  const data = {
    labels: last6.map(formatMonthLabel),
    datasets: [
      {
        label: 'Revenus',
        data: incomes,
        backgroundColor: 'rgba(52, 211, 153, 0.8)',
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'Dépenses',
        data: expenses,
        backgroundColor: 'rgba(248, 113, 113, 0.8)',
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#94a3b8',
          font: { size: 12 },
          boxWidth: 12,
          boxHeight: 12,
          borderRadius: 4,
          useBorderRadius: true,
        },
      },
      tooltip: {
        backgroundColor: '#1a2235',
        borderColor: 'rgba(255,255,255,0.07)',
        borderWidth: 1,
        titleColor: '#e2e8f0',
        bodyColor: '#94a3b8',
        padding: 12,
        callbacks: {
          label: (ctx) =>
            ` ${new Intl.NumberFormat('fr-FR').format(ctx.raw)} FCFA`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#64748b', font: { size: 12 } },
        grid:  { display: false },
        border:{ display: false },
      },
      y: {
        ticks: {
          color: '#64748b',
          font: { size: 11 },
          callback: (v) =>
            v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v,
        },
        grid:  { color: 'rgba(255,255,255,0.04)' },
        border:{ display: false },
      },
    },
  }

  return (
    <div className="bg-[#111827] border border-white/5 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold">Revenus vs Dépenses</h2>
        <span className="text-xs text-slate-500">6 derniers mois</span>
      </div>
      <div className="h-48 md:h-56">
        <Bar data={data} options={options} />
      </div>
    </div>
  )
}