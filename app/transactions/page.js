'use client';

import { useState, useEffect } from 'react';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import TransactionChart from './TransactionChart';
import CategoryChart from './CategoryChart';
import Dashboard from './Dashboard';
import BudgetManager from './BudgetManager';
import BudgetComparisonChart from './BudgetComparisonChart';
import BudgetInsights from './BudgetInsights';
import ErrorState from '../components/ErrorState';
import Loader from '../components/Loader';
import logo from '../../assets/Logo.png'

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard', 'transactions', 'charts', 'budgets'

  // For budgets tab
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };
  const [month, setMonth] = useState(getCurrentMonth());

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/transactions');
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (transactionData) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        throw new Error('Failed to add transaction');
      }

      await fetchTransactions();
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditTransaction = async (id, transactionData) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: id,
          ...transactionData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update transaction');
      }

      await fetchTransactions();
      setEditingTransaction(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }

      await fetchTransactions();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchTransactions} />;
  }

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 glow-effect">
            <img 
                src={logo.src}
                alt="Logo"
                className="w-8 h-8 sm:w-8 sm:h-8 text-white" 
            />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-2 sm:mb-4">
            Finance Tracker
          </h1>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
            Master your financial journey with intelligent insights and beautiful visualizations
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="flex bg-gray-800/50 backdrop-blur-sm rounded-lg p-1 w-full max-w-md overflow-x-auto space-x-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {[
              { value: 'dashboard', label: 'Dashboard', icon: '📊' },
              { value: 'transactions', label: 'Transactions', icon: '📝' },
              { value: 'charts', label: 'Charts', icon: '📈' },
              { value: 'budgets', label: 'Budgets & Insights', icon: '💡' }
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveView(tab.value)}
                className={`flex-1 min-w-[120px] px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 whitespace-nowrap ${
                  activeView === tab.value
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Add Transaction Button */}
        {activeView !== 'budgets' && (
          <div className="text-center mb-6 sm:mb-8">
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="hidden sm:inline">Add New Transaction</span>
              <span className="sm:hidden">Add Transaction</span>
            </button>
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
              <TransactionForm
                onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
                onCancel={() => {
                  setShowForm(false);
                  setEditingTransaction(null);
                }}
                transaction={editingTransaction}
              />
            </div>
          </div>
        )}

        {/* Content Based on Active View */}
        {activeView === 'dashboard' && (
          <Dashboard transactions={transactions} />
        )}

        {activeView === 'budgets' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Month Picker for Budgets */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
              <h2 className="text-lg font-bold text-white flex-1">Monthly Budgets & Insights</h2>
              <input
                type="month"
                value={month}
                onChange={e => setMonth(e.target.value)}
                className="input-field w-40"
              />
            </div>
            <BudgetManager month={month} />
            <BudgetComparisonChart transactions={transactions} month={month} />
            <BudgetInsights transactions={transactions} month={month} />
          </div>
        )}

        {activeView === 'transactions' && (
          <div className="space-y-6">
            {/* Balance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="card glass-effect">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-400 text-xs sm:text-sm font-medium">Total Balance</p>
                    <p className={`text-lg sm:text-xl lg:text-2xl font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'} truncate`}>
                      ${balance.toFixed(2)}
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ml-3">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="card glass-effect">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-400 text-xs sm:text-sm font-medium">Total Income</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-400 truncate">
                      ${totalIncome.toFixed(2)}
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ml-3">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="card glass-effect sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-400 text-xs sm:text-sm font-medium">Total Expenses</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-400 truncate">
                      ${totalExpenses.toFixed(2)}
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ml-3">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction List */}
            <div className="card glass-effect">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg mb-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">All Transactions</h3>
                <p className="text-gray-400 text-sm">Manage your financial records</p>
              </div>
              
              <TransactionList
                transactions={transactions}
                onEdit={handleEdit}
                onDelete={handleDeleteTransaction}
              />
            </div>
          </div>
        )}

        {activeView === 'charts' && (
          <div className="space-y-6">
            {/* Monthly Chart */}
            <div className="card glass-effect">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg mb-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Monthly Overview</h3>
                <p className="text-gray-400 text-sm">Track your monthly income and expenses</p>
              </div>
              
              <TransactionChart transactions={transactions} />
            </div>

            {/* Category Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CategoryChart transactions={transactions} type="expense" />
              <CategoryChart transactions={transactions} type="income" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 