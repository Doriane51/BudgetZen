import { useState } from 'react'
import useStore from '../../store/useStore'
import { categories } from '../../utils/categories'

const defaultForm = {
  type:        'expense',
  amount:      '',
  description: '',
  category:    'alimentation',
  date:        new Date().toISOString().slice(0, 10),
}

export default function TransactionModal({ open, onClose }) {
  const { addTransaction } = useStore()
  const [form, setForm] = useState(defaultForm)
  const [error, setError] = useState('')

  if (!open) return null

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = () => {
    if (!form.amount || Number(form.amount) <= 0) {
      setError('Veuillez entrer un montant valide.')
      return
    }
    if (!form.description.trim()) {
      setError('Veuillez entrer une description.')
      return
    }

    addTransaction({
      ...form,
      amount: Number(form.amount),
    })

    setForm(defaultForm)
    setError('')
    onClose()
  }

  return (
    <>
      {/* Fond */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold">Nouvelle transaction</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center text-slate-400 transition-all"
            >
              ✕
            </button>
          </div>

          {/* Type toggle */}
          <div className="grid grid-cols-2 bg-[#1a2235] rounded-xl p-1 mb-5">
            <button
              onClick={() => set('type', 'income')}
              className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                form.type === 'income'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ↑ Revenu
            </button>
            <button
              onClick={() => set('type', 'expense')}
              className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                form.type === 'expense'
                  ? 'bg-red-500/20 text-red-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ↓ Dépense
            </button>
          </div>

          {/* Montant */}
          <div className="mb-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Montant (FCFA)
            </label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={form.amount}
              onChange={(e) => set('amount', e.target.value)}
              className="w-full bg-[#1a2235] border border-white/5 focus:border-indigo-500 rounded-xl px-4 py-3 text-base font-mono outline-none transition-colors placeholder:text-slate-600"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Description
            </label>
            <input
              type="text"
              placeholder="Ex : Courses au marché..."
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              className="w-full bg-[#1a2235] border border-white/5 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-600"
            />
          </div>

          {/* Date */}
          <div className="mb-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
              className="w-full bg-[#1a2235] border border-white/5 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
            />
          </div>

          {/* Catégorie — uniquement pour les dépenses */}
          {form.type === 'expense' && (
            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Catégorie
              </label>
              <div className="grid grid-cols-5 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => set('category', cat.id)}
                    className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl text-xs transition-all border ${
                      form.category === cat.id
                        ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300'
                        : 'border-transparent bg-[#1a2235] text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-lg">{cat.emoji}</span>
                    <span className="text-[10px] leading-tight text-center">
                      {cat.label.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

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
              Enregistrer ✓
            </button>
          </div>

        </div>
      </div>
    </>
  )
}