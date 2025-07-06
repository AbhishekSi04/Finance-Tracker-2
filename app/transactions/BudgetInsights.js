'use client';

import { useEffect, useState } from 'react';
import { categories } from '../../lib/categories';

export default function BudgetInsights({ transactions, month }) {
  const [budgets, setBudgets] = useState([]);
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
      setBudgets(data);
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
    // Ensure t.date is a string in YYYY-MM-DD or ISO format
    const tMonth = t.date.slice(0, 7);
    if (tMonth !== month) return;
    actuals[t.category] = (actuals[t.category] || 0) + t.amount;
  });

  // Merge all categories that have a budget or actuals
  const allCategories = Array.from(new Set([
    ...budgets.map(b => b.category),
    ...Object.keys(actuals)
  ]));

  // Compare budgets and actuals for all relevant categories
  const insights = allCategories.map(category => {
    const budgetObj = budgets.find(b => b.category === category);
    const budget = budgetObj ? budgetObj.amount : 0;
    const spent = actuals[category] || 0;
    return {
      category,
      budget,
      spent,
      over: spent > budget && budget > 0,
      under: spent < budget && budget > 0,
      diff: spent - budget
    };
  });

  const overBudget = insights.filter(i => i.over);
  const underBudget = insights.filter(i => i.under);
  const totalOver = overBudget.reduce((sum, i) => sum + i.diff, 0);
  const totalUnder = underBudget.reduce((sum, i) => sum + Math.abs(i.diff), 0);

  if (loading) return <div className="text-gray-400">Loading insights...</div>;
  if (error) return <div className="text-red-400">{error}</div>;
  if (insights.length === 0) return <div className="text-gray-400">No budgets or spending for this month.</div>;

  return (
    <div className="card glass-effect mb-6 p-3 sm:p-6">
      <div className="text-center mb-4">
        <h3 className="text-base sm:text-lg font-bold text-white mb-1">Spending Insights</h3>
        <p className="text-gray-400 text-xs sm:text-sm">For {month}</p>
      </div>
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2 justify-center mb-2">
          <span className="inline-block px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-semibold">
            {overBudget.length} categories over budget
          </span>
          <span className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">
            {underBudget.length} categories under budget
          </span>
        </div>
        <div className="flex flex-wrap gap-2 justify-center mb-2">
          <span className="inline-block px-3 py-1 rounded-full bg-red-500/10 text-red-300 text-xs">
            Total over: ${totalOver.toFixed(2)}
          </span>
          <span className="inline-block px-3 py-1 rounded-full bg-green-500/10 text-green-300 text-xs">
            Total under: ${totalUnder.toFixed(2)}
          </span>
        </div>
        <div className="divide-y divide-gray-700">
          {insights.map(i => (
            <div key={i.category} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 gap-1 sm:gap-0">
              <div className="flex items-center gap-2 min-w-0">
                <span>{categories[i.category]?.icon}</span>
                <span className="text-xs sm:text-sm text-gray-300 truncate">{i.category}</span>
              </div>
              <div className="text-right flex flex-wrap gap-1 sm:gap-2 items-center justify-end">
                <span className="text-xs sm:text-sm text-gray-400 mr-2">Budget: ${i.budget.toFixed(2)}</span>
                <span className={`text-xs sm:text-sm font-semibold ${i.over ? 'text-red-400' : i.under ? 'text-green-400' : 'text-gray-400'}`}>
                  Spent: ${i.spent.toFixed(2)}
                </span>
                {i.over && (
                  <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold">Over</span>
                )}
                {i.under && i.spent > 0 && (
                  <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">Under</span>
                )}
                {!i.over && !i.under && i.budget > 0 && i.spent === i.budget && (
                  <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">On Budget</span>
                )}
                {i.budget === 0 && i.spent > 0 && (
                  <span className="px-2 py-1 rounded-full bg-gray-500/20 text-gray-400 text-xs font-bold">No Budget</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 