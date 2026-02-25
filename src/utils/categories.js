export const categories = [
  {
    id: 'alimentation',
    label: 'Alimentation',
    emoji: '🛒',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.15)',
  },
  {
    id: 'transport',
    label: 'Transport',
    emoji: '🚗',
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.15)',
  },
  {
    id: 'logement',
    label: 'Logement',
    emoji: '🏠',
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.15)',
  },
  {
    id: 'sante',
    label: 'Santé',
    emoji: '💊',
    color: '#ec4899',
    bgColor: 'rgba(236, 72, 153, 0.15)',
  },
  {
    id: 'loisirs',
    label: 'Loisirs',
    emoji: '🎮',
    color: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.15)',
  },
  {
    id: 'education',
    label: 'Éducation',
    emoji: '📚',
    color: '#84cc16',
    bgColor: 'rgba(132, 204, 22, 0.15)',
  },
  {
    id: 'vetements',
    label: 'Vêtements',
    emoji: '👕',
    color: '#f97316',
    bgColor: 'rgba(249, 115, 22, 0.15)',
  },
  {
    id: 'travail',
    label: 'Travail',
    emoji: '💼',
    color: '#34d399',
    bgColor: 'rgba(52, 211, 153, 0.15)',
  },
  {
    id: 'autre',
    label: 'Autre',
    emoji: '📦',
    color: '#6b7280',
    bgColor: 'rgba(107, 114, 128, 0.15)',
  },
]

// Fonction utilitaire — retrouver une catégorie par son id
export const getCategoryById = (id) => {
  return categories.find((cat) => cat.id === id) ?? categories.at(-1)
}