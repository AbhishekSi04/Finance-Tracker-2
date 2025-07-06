export const categories = {
  // Expense categories
  'Food & Dining': {
    icon: '🍽️',
    color: '#FF6B6B',
    type: 'expense'
  },
  'Transportation': {
    icon: '🚗',
    color: '#4ECDC4',
    type: 'expense'
  },
  'Shopping': {
    icon: '🛍️',
    color: '#45B7D1',
    type: 'expense'
  },
  'Entertainment': {
    icon: '🎬',
    color: '#96CEB4',
    type: 'expense'
  },
  'Healthcare': {
    icon: '🏥',
    color: '#FFEAA7',
    type: 'expense'
  },
  'Utilities': {
    icon: '⚡',
    color: '#DDA0DD',
    type: 'expense'
  },
  'Housing': {
    icon: '🏠',
    color: '#98D8C8',
    type: 'expense'
  },
  'Education': {
    icon: '📚',
    color: '#F7DC6F',
    type: 'expense'
  },
  'Travel': {
    icon: '✈️',
    color: '#BB8FCE',
    type: 'expense'
  },
  'Other Expenses': {
    icon: '💸',
    color: '#85C1E9',
    type: 'expense'
  },
  // Income categories
  'Salary': {
    icon: '💰',
    color: '#52C41A',
    type: 'income'
  },
  'Freelance': {
    icon: '💼',
    color: '#1890FF',
    type: 'income'
  },
  'Investment': {
    icon: '📈',
    color: '#722ED1',
    type: 'income'
  },
  'Business': {
    icon: '🏢',
    color: '#13C2C2',
    type: 'income'
  },
  'Other Income': {
    icon: '💵',
    color: '#FA8C16',
    type: 'income'
  }
};

export const getCategoriesByType = (type) => {
  return Object.entries(categories)
    .filter(([_, config]) => config.type === type)
    .reduce((acc, [name, config]) => {
      acc[name] = config;
      return acc;
    }, {});
};

export const getCategoryInfo = (categoryName) => {
  return categories[categoryName] || {
    icon: '❓',
    color: '#999999',
    type: 'unknown'
  };
}; 