import StatsCards          from '../components/dashboard/StatsCards'
import BarChart            from '../components/dashboard/BarChart'
import DoughnutChart       from '../components/dashboard/DoughnutChart'
import RecentTransactions  from '../components/dashboard/RecentTransactions'
import BudgetProgress      from '../components/dashboard/BudgetProgress'

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <BarChart />
        </div>
        <DoughnutChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <RecentTransactions />
        <BudgetProgress />
      </div>
    </div>
  )
}