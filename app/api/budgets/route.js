import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Budget from '../../../models/Budget';

// GET /api/budgets?month=YYYY-MM
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const filter = month ? { month } : {};
    const budgets = await Budget.find(filter).lean();
    return NextResponse.json(budgets);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  }
}

// POST /api/budgets (create or update)
export async function POST(request) {
  try {
    await connectDB();
    const { category, month, amount } = await request.json();
    if (!category || !month || typeof amount !== 'number') {
      return NextResponse.json({ error: 'Category, month, and amount are required' }, { status: 400 });
    }
    // Upsert (create or update)
    const budget = await Budget.findOneAndUpdate(
      { category, month },
      { category, month, amount },
      { upsert: true, new: true, runValidators: true }
    );
    return NextResponse.json(budget);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save budget' }, { status: 500 });
  }
}

// DELETE /api/budgets?id=budgetId
export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Budget id is required' }, { status: 400 });
    }
    await Budget.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Budget deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete budget' }, { status: 500 });
  }
} 