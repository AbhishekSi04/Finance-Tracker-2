'use client';

import { useState } from 'react';
import { getCategoryInfo } from '../../lib/categories';

export default function Dashboard({ transactions }) {
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  // Filter transactions by period
  const getFilteredTransactions = () => {
    if (selectedPeriod === 'all') return transactions;
    
    const now = new Date();
    const startDate = new Date();
    
    switch (selectedPeriod) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return transactions;
    }
    
    return transactions.filter(t => new Date(t.date) >= startDate);
  };

  const filteredTransactions = getFilteredTransactions();

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Get category breakdown
  const getCategoryBreakdown = (type) => {
    const typeTransactions = filteredTransactions.filter(t => t.type === type);
    const breakdown = typeTransactions.reduce((acc, transaction) => {
      const category = transaction.category || 'Other';
      acc[category] = (acc[category] || 0) + transaction.amount;
      return acc;
    }, {});

    return Object.entries(breakdown)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5); // Top 5 categories
  };

  const topExpenseCategories = getCategoryBreakdown('expense');
  const topIncomeCategories = getCategoryBreakdown('income');

  // Get most recent transactions
  const recentTransactions = filteredTransactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Period Filter */}
      {/* <div className="flex justify-center">
        <div className="inline-flex bg-gray-800 rounded-lg p-1 w-full max-w-sm">
          {[
            { value: 'all', label: 'All Time' },
            { value: 'week', label: 'This Week' },
            { value: 'month', label: 'This Month' },
            { value: 'year', label: 'This Year' }
          ].map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              className={`flex-1 px-2 py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${
                selectedPeriod === period.value
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <span className="truncate">{period.label}</span>
            </button>
          ))}
        </div>
      </div> */}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {/* Balance Card */}
        <div className="card glass-effect">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-gray-400 text-xs sm:text-sm font-medium">Total Balance</p>
              <p className={`text-base sm:text-lg lg:text-xl xl:text-2xl font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'} truncate`}>
                ${balance.toFixed(2)}
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ml-2 sm:ml-3">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        {/* Income Card */}
        <div className="card glass-effect">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-gray-400 text-xs sm:text-sm font-medium">Total Income</p>
              <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-green-400 truncate">
                ${totalIncome.toFixed(2)}
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ml-2 sm:ml-3">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </div>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="card glass-effect">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-gray-400 text-xs sm:text-sm font-medium">Total Expenses</p>
              <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-red-400 truncate">
                ${totalExpenses.toFixed(2)}
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ml-2 sm:ml-3">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Categories */}
        <div className="card glass-effect">
          <div className="text-center mb-4 sm:mb-6">
            <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg mb-2 sm:mb-3">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-1">Top Categories</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Your spending patterns</p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {/* Top Expense Categories */}
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-red-400 mb-2 sm:mb-3">Top Expenses</h4>
              <div className="space-y-2 sm:space-y-3">
                {topExpenseCategories.length > 0 ? (
                  topExpenseCategories.map(([category, amount]) => {
                    const categoryInfo = getCategoryInfo(category);
                    const percentage = totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) : 0;
                    
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <span className="text-base sm:text-lg">{categoryInfo.icon}</span>
                          <span className="text-xs sm:text-sm text-gray-300 truncate">{category}</span>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <p className="text-xs sm:text-sm font-semibold text-white">${amount.toFixed(2)}</p>
                          <p className="text-xs text-gray-400">{percentage}%</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-400 text-xs sm:text-sm text-center py-3 sm:py-4">No expense data</p>
                )}
              </div>
            </div>

            {/* Top Income Categories */}
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-green-400 mb-2 sm:mb-3">Top Income</h4>
              <div className="space-y-2 sm:space-y-3">
                {topIncomeCategories.length > 0 ? (
                  topIncomeCategories.map(([category, amount]) => {
                    const categoryInfo = getCategoryInfo(category);
                    const percentage = totalIncome > 0 ? ((amount / totalIncome) * 100).toFixed(1) : 0;
                    
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <span className="text-base sm:text-lg">{categoryInfo.icon}</span>
                          <span className="text-xs sm:text-sm text-gray-300 truncate">{category}</span>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <p className="text-xs sm:text-sm font-semibold text-white">${amount.toFixed(2)}</p>
                          <p className="text-xs text-gray-400">{percentage}%</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-400 text-xs sm:text-sm text-center py-3 sm:py-4">No income data</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card glass-effect">
          <div className="text-center mb-4 sm:mb-6">
            <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg mb-2 sm:mb-3">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-1">Recent Transactions</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Latest activity</p>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => {
                const categoryInfo = getCategoryInfo(transaction.category);
                
                return (
                  <div key={transaction._id} className="flex items-center justify-between p-2 sm:p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <span className="text-base sm:text-lg">{categoryInfo.icon}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-white truncate">{transaction.description}</p>
                        <p className="text-xs text-gray-400">{formatDate(transaction.date)}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className={`text-xs sm:text-sm font-semibold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{transaction.category}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 text-xs sm:text-sm text-center py-6 sm:py-8">No transactions yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 