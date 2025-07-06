'use client';

import { useState, useEffect } from 'react';
import { categories } from '../../lib/categories';

export default function BudgetManager({ month }) {
  const [budgets, setBudgets] = useState([]);
  const [form, setForm] = useState({ category: '', amount: '' });
  const [editingId, setEditingId] = useState(null);
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
    } catch (err) {
      setError('Failed to fetch budgets');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (budget) => {
    setEditingId(budget._id);
    setForm({ category: budget.category, amount: budget.amount });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this budget?')) return;
    setLoading(true);
    setError(null);
    try {
      await fetch(`/api/budgets?id=${id}`, { method: 'DELETE' });
      fetchBudgets();
    } catch {
      setError('Failed to delete budget');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category || !form.amount) return;
    setLoading(true);
    setError(null);
    try {
      await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: form.category,
          month,
          amount: Number(form.amount)
        })
      });
      setForm({ category: '', amount: '' });
      setEditingId(null);
      fetchBudgets();
    } catch {
      setError('Failed to save budget');
    } finally {
      setLoading(false);
    }
  };

  const allCategories = Object.keys(categories);

  return (
    <div className="card glass-effect mb-6 p-3 sm:p-6">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
        <select
          name="category"
          value={form.category}
          onChange={handleFormChange}
          className="input-field flex-1 min-w-0"
        >
          <option value="">Select Category</option>
          {allCategories.map((cat) => (
            <option key={cat} value={cat}>{categories[cat].icon} {cat}</option>
          ))}
        </select>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleFormChange}
          min="0"
          step="0.01"
          placeholder="Budget Amount"
          className="input-field flex-1 min-w-0"
        />
        <button type="submit" className="btn-primary min-w-[100px] w-full sm:w-auto">
          {editingId ? 'Update' : 'Add'}
        </button>
      </form>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs sm:text-sm">
            <thead>
              <tr className="text-gray-400">
                <th className="py-2 px-2 text-left">Category</th>
                <th className="py-2 px-2 text-left">Budget</th>
                <th className="py-2 px-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {budgets.length === 0 && (
                <tr><td colSpan={3} className="text-gray-500 py-4 text-center">No budgets set for this month.</td></tr>
              )}
              {budgets.map((budget) => (
                <tr key={budget._id} className="border-t border-gray-700">
                  <td className="py-2 px-2 flex items-center gap-2">
                    <span>{categories[budget.category]?.icon}</span>
                    <span>{budget.category}</span>
                  </td>
                  <td className="py-2 px-2">${budget.amount.toFixed(2)}</td>
                  <td className="py-2 px-2 flex gap-2 flex-wrap">
                    <button
                      type="button"
                      className="btn-secondary px-2 py-1"
                      onClick={() => handleEdit(budget)}
                    >Edit</button>
                    <button
                      type="button"
                      className="btn-danger px-2 py-1"
                      onClick={() => handleDelete(budget._id)}
                    >Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 