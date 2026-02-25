import { useState } from 'react'
import useStore from '../../store/useStore'

const emojis = ['✈️','🏠','💻','🚗','📱','🎓','💍','🏖️','💰','🎯']

const defaultForm = {
  name:          '',
  targetAmount:  '',
  currentAmount: '',
  deadline:      '',
  emoji:         '🎯',
}

export default function GoalForm({ open, onClose }) {
  const { addGoal } = useStore()
  const [form, setForm] = useState(defaultForm)
  const [error, setError] = useState('')

  if (!open) return null

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = () => {
    if (!form.name.trim()) {
      setError('Veuillez entrer un nom pour l\'objectif.')
      return
    }
    if (!form.targetAmount || Number(form.targetAmount) <= 0) {
      setError('Veuillez entrer un montant cible valide.')
      return
    }
    if (!form.deadline) {
      setError('Veuillez choisir une date d\'échéance.')
      return
    }

    addGoal({
      ...form,
      targetAmount:  Number(form.targetAmount),
      currentAmount: Number(form.currentAmount) || 0,
    })

    setForm(defaultForm)
    setError('')
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold">Nouvel objectif</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center text-slate-400 transition-all"
            >
              ✕
            </button>
          </div>

          {/* Choix emoji */}
          <div className="mb-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Icône
            </label>
            <div className="flex gap-2 flex-wrap">
              {emojis.map((e) => (
                <button
                  key={e}
                  onClick={() => set('emoji', e)}
                  className={`w-10 h-10 rounded-xl text-xl transition-all border ${
                    form.emoji === e
                      ? 'border-indigo-500 bg-indigo-500/15'
                      : 'border-transparent bg-[#1a2235] hover:bg-white/5'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Nom */}
          <div className="mb-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Nom de l'objectif
            </label>
            <input
              type="text"
              placeholder="Ex : Voyage en Europe..."
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className="w-full bg-[#1a2235] border border-white/5 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-600"
            />
          </div>

          {/* Montants */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Montant cible (FCFA)
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={form.targetAmount}
                onChange={(e) => set('targetAmount', e.target.value)}
                className="w-full bg-[#1a2235] border border-white/5 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm font-mono outline-none transition-colors placeholder:text-slate-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Déjà épargné (FCFA)
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={form.currentAmount}
                onChange={(e) => set('currentAmount', e.target.value)}
                className="w-full bg-[#1a2235] border border-white/5 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm font-mono outline-none transition-colors placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Deadline */}
          <div className="mb-5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Date d'échéance
            </label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => set('deadline', e.target.value)}
              className="w-full bg-[#1a2235] border border-white/5 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
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
              Créer l'objectif ✓
            </button>
          </div>

        </div>
      </div>
    </>
  )
}