import { useState } from 'react'
import useStore from '../../store/useStore'

const formatAmount = (amount) =>
  new Intl.NumberFormat('fr-FR').format(amount)

export default function ContributionModal({ goal, onClose }) {
  const { addContribution } = useStore()
  const [amount, setAmount] = useState('')
  const [error, setError]   = useState('')

  if (!goal) return null

  const remaining = goal.targetAmount - goal.currentAmount

  const handleSubmit = () => {
    if (!amount || Number(amount) <= 0) {
      setError('Veuillez entrer un montant valide.')
      return
    }
    addContribution(goal.id, Number(amount))
    setAmount('')
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{goal.emoji}</span>
              <div>
                <h2 className="text-base font-bold">{goal.name}</h2>
                <p className="text-xs text-slate-500">
                  {formatAmount(goal.currentAmount)} / {formatAmount(goal.targetAmount)} FCFA
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center text-slate-400 transition-all"
            >
              ✕
            </button>
          </div>

          {/* Restant */}
          <div className="bg-[#1a2235] rounded-xl p-3 mb-4 text-center">
            <p className="text-xs text-slate-500 mb-1">Reste à épargner</p>
            <p className="font-mono text-lg font-medium text-amber-400">
              {formatAmount(remaining)} FCFA
            </p>
          </div>

          {/* Montant */}
          <div className="mb-5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Montant à ajouter (FCFA)
            </label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setError('') }}
              className="w-full bg-[#1a2235] border border-white/5 focus:border-indigo-500 rounded-xl px-4 py-3 text-base font-mono outline-none transition-colors placeholder:text-slate-600"
            />
          </div>

          {/* Erreur */}
          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-4">
              ⚠ {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-semibold text-slate-400 transition-all"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className="flex-2 py-3 bg-indigo-500 hover:bg-indigo-400 rounded-xl text-sm font-semibold text-white transition-all shadow-lg shadow-indigo-500/25"
            >
              Ajouter ✓
            </button>
          </div>

        </div>
      </div>
    </>
  )
}