'use client';

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { getCategoryInfo } from '../../lib/categories';

Chart.register(...registerables);

export default function CategoryChart({ transactions, type = 'expense' }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!transactions || transactions.length === 0) return;

    // Filter transactions by type
    const filteredTransactions = transactions.filter(t => t.type === type);
    
    if (filteredTransactions.length === 0) return;

    // Group by category and calculate totals
    const categoryData = filteredTransactions.reduce((acc, transaction) => {
      const category = transaction.category || 'Other';
      acc[category] = (acc[category] || 0) + transaction.amount;
      return acc;
    }, {});

    // Sort by amount (descending)
    const sortedCategories = Object.entries(categoryData)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8); // Show top 8 categories

    const labels = sortedCategories.map(([category]) => category);
    const data = sortedCategories.map(([, amount]) => amount);
    const colors = sortedCategories.map(([category]) => {
      const categoryInfo = getCategoryInfo(category);
      return categoryInfo.color;
    });

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderColor: '#1f2937',
          borderWidth: 2,
          hoverBorderColor: '#374151',
          hoverBorderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#d1d5db',
              font: {
                size: 12
              },
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            titleColor: '#f9fafb',
            bodyColor: '#d1d5db',
            borderColor: '#374151',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: $${value.toFixed(2)} (${percentage}%)`;
              }
            }
          }
        },
        cutout: '60%',
        animation: {
          animateRotate: true,
          animateScale: true
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [transactions, type]);

  const totalAmount = transactions
    ?.filter(t => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0) || 0;

  if (!transactions || transactions.length === 0) {
    return (
      <div className="card glass-effect">
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-600 rounded-full mb-4">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No {type} data</h3>
          <p className="text-gray-400 text-sm">Add some {type} transactions to see the chart</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card glass-effect">
      <div className="text-center mb-4 sm:mb-6">
        <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg mb-2 sm:mb-3">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
        </div>
        <h3 className="text-base sm:text-lg font-bold text-white mb-1">
          {type === 'expense' ? 'Expenses' : 'Income'} by Category
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm">
          Total: ${totalAmount.toFixed(2)}
        </p>
      </div>
      
      <div className="relative h-48 sm:h-64 lg:h-80">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
} 