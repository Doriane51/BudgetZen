import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

const useStore = create(
  persist(
    (set, get) => ({

      // ─── TRANSACTIONS ───────────────────────────────
      transactions: [],

      addTransaction: (transaction) => set((state) => ({
        transactions: [
          { ...transaction, id: uuidv4(), createdAt: new Date().toISOString() },
          ...state.transactions,
        ]
      })),

      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id)
      })),

      editTransaction: (id, updated) => set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === id ? { ...t, ...updated } : t
        )
      })),

      // ─── BUDGETS ────────────────────────────────────
      budgets: [],

      addBudget: (budget) => set((state) => ({
        budgets: [
          { ...budget, id: uuidv4(), createdAt: new Date().toISOString() },
          ...state.budgets,
        ]
      })),

      deleteBudget: (id) => set((state) => ({
        budgets: state.budgets.filter((b) => b.id !== id)
      })),

      // ─── OBJECTIFS D'ÉPARGNE ────────────────────────
      goals: [],

      addGoal: (goal) => set((state) => ({
        goals: [
          { ...goal, id: uuidv4(), createdAt: new Date().toISOString() },
          ...state.goals,
        ]
      })),

      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter((g) => g.id !== id)
      })),

      addContribution: (goalId, amount) => set((state) => ({
        goals: state.goals.map((g) =>
          g.id === goalId
            ? { ...g, currentAmount: g.currentAmount + Number(amount) }
            : g
        )
      })),

      // ─── MOIS ACTIF ─────────────────────────────────
      activeMonth: new Date().toISOString().slice(0, 7), // "2026-02"

      setActiveMonth: (month) => set({ activeMonth: month }),

      // ─── HELPERS (calculs dérivés) ──────────────────
      getMonthTransactions: () => {
        const { transactions, activeMonth } = get()
        return transactions.filter((t) => t.date.startsWith(activeMonth))
      },

      getMonthExpenses: () => {
        return get().getMonthTransactions().filter((t) => t.type === 'expense')
      },

      getMonthIncomes: () => {
        return get().getMonthTransactions().filter((t) => t.type === 'income')
      },

      getTotalExpenses: () => {
        return get().getMonthExpenses().reduce((sum, t) => sum + t.amount, 0)
      },

      getTotalIncomes: () => {
        return get().getMonthIncomes().reduce((sum, t) => sum + t.amount, 0)
      },

      getBalance: () => {
        return get().getTotalIncomes() - get().getTotalExpenses()
      },

    }),
    {
      name: 'budgetzen-storage', // clé dans le localStorage
    }
  )
)

export default useStore