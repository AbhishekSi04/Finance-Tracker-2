'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { categories } from '../../lib/categories';

Chart.register(...registerables);

export default function BudgetComparisonChart({ transactions, month }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [budgetData, setBudgetData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBudgets();
    // eslint-disable-next-line
  }, [month]);

  const fetchBudgets = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/budgets?month=${month}`);
      const data = await res.json();
      setBudgetData(data);
    } catch {
      setError('Failed to fetch budgets');
    } finally {
      setLoading(false);
    }
  };

  // Calculate actual spent per category for the month
  const actuals = {};
  transactions.forEach((t) => {
    if (t.type !== 'expense') return;
    const tMonth = t.date.slice(0, 7);
    if (tMonth !== month) return;
    actuals[t.category] = (actuals[t.category] || 0) + t.amount;
  });

  // Prepare chart data
  const allBudgetCategories = budgetData.map(b => b.category);
  const allCategories = Array.from(new Set([...allBudgetCategories, ...Object.keys(actuals)]));
  const budgetAmounts = allCategories.map(cat => {
    const found = budgetData.find(b => b.category === cat);
    return found ? found.amount : 0;
  });
  const actualAmounts = allCategories.map(cat => actuals[cat] || 0);
  const barColors = allCategories.map(cat => categories[cat]?.color || '#888');

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();
    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: allCategories,
        datasets: [
          {
            label: 'Budget',
            data: budgetAmounts,
            backgroundColor: barColors.map(c => c + '99'),
            borderColor: barColors,
            borderWidth: 1
          },
          {
            label: 'Actual',
            data: actualAmounts,
            backgroundColor: barColors,
            borderColor: barColors,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { color: '#d1d5db', font: { size: 12 } } },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
              }
            }
          }
        },
        scales: {
          x: {
            ticks: { color: '#d1d5db', font: { size: 10 } },
            grid: { color: '#374151' }
          },
          y: {
            beginAtZero: true,
            ticks: { color: '#d1d5db', font: { size: 10 } },
            grid: { color: '#374151' }
          }
        }
      }
    });
    // eslint-disable-next-line
  }, [budgetData, transactions, month]);

  if (loading) return <div className="text-gray-400">Loading chart...</div>;
  if (error) return <div className="text-red-400">{error}</div>;
  if (allCategories.length === 0) return <div className="text-gray-400">No budget or spending data for this month.</div>;

  return (
    <div className="card glass-effect mb-6 p-3 sm:p-6">
      <div className="text-center mb-4">
        <h3 className="text-base sm:text-lg font-bold text-white mb-1">Budget vs Actual (by Category)</h3>
        <p className="text-gray-400 text-xs sm:text-sm">Comparison for {month}</p>
      </div>
      <div className="relative h-56 xs:h-64 sm:h-80 md:h-[28rem] w-full overflow-x-auto">
        <canvas ref={chartRef} className="w-full h-full min-w-[400px]" />
      </div>
      <div className="mt-2 flex flex-wrap gap-2 justify-center">
        <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">Budget</span>
        <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">Actual</span>
      </div>
    </div>
  );
} 