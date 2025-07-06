import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    trim: true
  },
  month: {
    type: String, // Format: 'YYYY-MM'
    required: true,
    match: /^\d{4}-\d{2}$/
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

BudgetSchema.index({ category: 1, month: 1 }, { unique: true });

const Budget = mongoose.models.Budget || mongoose.model('Budget', BudgetSchema);

export default Budget; 