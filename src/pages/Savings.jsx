import { useState } from 'react'
import useStore from '../store/useStore'
import GoalForm from '../components/savings/GoalForm'
import ContributionModal from '../components/savings/ContributionModal'

const formatAmount = (amount) =>
  new Intl.NumberFormat('fr-FR').format(amount)

const getDaysLeft = (deadline) => {
  const diff = new Date(deadline) - new Date()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

const getMonthlyNeeded = (goal) => {
  const remaining = goal.targetAmount - goal.currentAmount
  if (remaining <= 0) return 0
  const daysLeft   = getDaysLeft(goal.deadline)
  const monthsLeft = Math.max(1, daysLeft / 30)
  return Math.ceil(remaining / monthsLeft)
}

export default function Savings() {
  const { goals, deleteGoal } = useStore()
  const [showForm,         setShowForm]         = useState(false)
  const [selectedGoal,     setSelectedGoal]     = useState(null)

  // Stats globales
  const totalTarget  = goals.reduce((s, g) => s + g.targetAmount,  0)
  const totalCurrent = goals.reduce((s, g) => s + g.currentAmount, 0)

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Objectifs d'épargne</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {goals.length} objectif{goals.length > 1 ? 's' : ''} en cours
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-500/25"
        >
          ＋ Nouvel objectif
        </button>
      </div>

      {/* Résumé global */}
      {goals.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#111827] border border-white/5 rounded-2xl p-4">
            <div className="text-xs text-slate-500 mb-1">Objectifs</div>
            <div className="font-mono text-lg font-medium">{goals.length}</div>
          </div>
          <div className="bg-[#111827] border border-white/5 rounded-2xl p-4">
            <div className="text-xs text-slate-500 mb-1">Total épargné</div>
            <div className="font-mono text-lg font-medium text-emerald-400">
              {formatAmount(totalCurrent)}
            </div>
          </div>
          <div className="bg-[#111827] border border-white/5 rounded-2xl p-4">
            <div className="text-xs text-slate-500 mb-1">Total cible</div>
            <div className="font-mono text-lg font-medium text-indigo-400">
              {formatAmount(totalTarget)}
            </div>
          </div>
        </div>
      )}

      {/* Etat vide */}
      {goals.length === 0 && (
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-12 flex flex-col items-center gap-3">
          <span className="text-5xl">◇</span>
          <p className="text-slate-400 font-medium">Aucun objectif pour l'instant</p>
          <p className="text-slate-500 text-sm text-center max-w-xs">
            Définis des objectifs d'épargne pour rester motivé et suivre ta progression
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            Créer mon premier objectif →
          </button>
        </div>
      )}

      {/* Grille d'objectifs */}
      {goals.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => {
            const pct          = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
            const daysLeft     = getDaysLeft(goal.deadline)
            const monthlyNeed  = getMonthlyNeeded(goal)
            const completed    = pct >= 100

            return (
              <div
                key={goal.id}
                className="bg-[#111827] border border-white/5 rounded-2xl p-5 flex flex-col gap-4 hover:-translate-y-0.5 transition-transform group"
              >
                {/* Top */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-3xl">{goal.emoji}</span>
                    <div className="text-sm font-semibold mt-2">{goal.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      🗓 {new Date(goal.deadline).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </div>
                  </div>

                  {completed && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400">
                      ✓ Atteint
                    </span>
                  )}
                </div>

                {/* Montants */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-mono text-base font-medium text-slate-200">
                      {formatAmount(goal.currentAmount)}
                    </span>
                    <span className="font-mono text-sm text-slate-500 self-end">
                      / {formatAmount(goal.targetAmount)}
                    </span>
                  </div>

                  {/* Barre */}
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: completed ? '#34d399' : '#6366f1',
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-slate-500">
                    <span className="font-mono font-medium text-slate-300">
                      {pct.toFixed(1)}%
                    </span>
                    <span>{daysLeft} jours restants</span>
                  </div>
                </div>

                {/* Conseil mensuel */}
                {!completed && (
                  <div className="bg-[#1a2235] rounded-xl px-3 py-2 text-xs text-slate-400">
                    Épargner <span className="text-indigo-400 font-semibold font-mono">
                      {formatAmount(monthlyNeed)} FCFA/mois
                    </span> pour atteindre l'objectif
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  {!completed && (
                    <button
                      onClick={() => setSelectedGoal(goal)}
                      className="flex-1 py-2 bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-400 text-xs font-semibold rounded-xl transition-all"
                    >
                      ＋ Contribuer
                    </button>
                  )}
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="opacity-0 group-hover:opacity-100 py-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-xl transition-all"
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
            className="bg-[#111827] border border-dashed border-white/10 hover:border-indigo-500/50 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-indigo-400 transition-all min-h-48"
          >
            <span className="text-3xl">◇</span>
            <span className="text-sm font-medium">Nouvel objectif</span>
          </button>
        </div>
      )}

      {/* Modals */}
      <GoalForm
        open={showForm}
        onClose={() => setShowForm(false)}
      />
      <ContributionModal
        goal={selectedGoal}
        onClose={() => setSelectedGoal(null)}
      />

    </div>
  )
}