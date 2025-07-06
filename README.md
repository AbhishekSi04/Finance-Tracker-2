# Finance Tracker

A modern, responsive finance tracking application built with Next.js, featuring beautiful visualizations and intelligent insights.

## 🚀 Features

### Stage 1: Basic Transaction Tracking ✅
- **Add/Edit/Delete transactions** with amount, date, and description
- **Transaction list view** with full CRUD operations
- **Monthly expenses bar chart** using Chart.js
- **Basic form validation** for all inputs
- **Responsive design** that works on all devices

### Stage 2: Categories & Dashboard ✅
- **Predefined categories** for both expenses and income
- **Category-wise pie charts** with beautiful visualizations
- **Dashboard with summary cards** showing:
  - Total balance, income, and expenses
  - Category breakdown with percentages
  - Most recent transactions
- **Navigation system** with three main views:
  - 📊 Dashboard
  - 📝 Transactions
  - 📈 Charts

## 🎯 Key Features

### Transaction Management
- **Smart Categories**: 10 expense categories + 5 income categories
- **Dynamic Forms**: Categories change based on transaction type
- **Real-time Updates**: All changes reflect immediately
- **Mobile-First**: Fully responsive on all screen sizes

### Visual Analytics
- **Monthly Overview Chart**: Bar chart showing income vs expenses
- **Category Pie Charts**: Separate charts for expenses and income
- **Dashboard Insights**: Top categories with percentages
- **Period Filtering**: View data by week, month, year, or all time

### User Experience
- **Beautiful UI**: Glass morphism effects and smooth animations
- **Intuitive Navigation**: Easy switching between views
- **Touch-Friendly**: Optimized for mobile devices
- **Real-time Feedback**: Instant validation and error handling

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Charts**: Chart.js for beautiful visualizations
- **Styling**: Custom CSS with glass morphism effects

## 📱 Responsive Design

The application is fully responsive and optimized for:
- 📱 **Mobile phones** (320px+)
- 📱 **Large phones** (480px+)
- 📱 **Tablets** (768px+)
- 💻 **Laptops** (1024px+)
- 🖥️ **Desktop** (1280px+)

## 🎨 Categories

### Expense Categories
- 🍽️ Food & Dining
- 🚗 Transportation
- 🛍️ Shopping
- 🎬 Entertainment
- 🏥 Healthcare
- ⚡ Utilities
- 🏠 Housing
- 📚 Education
- ✈️ Travel
- 💸 Other Expenses

### Income Categories
- 💰 Salary
- 💼 Freelance
- 📈 Investment
- 🏢 Business
- 💵 Other Income

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up MongoDB**:
   - Create a MongoDB database
   - Update connection string in `lib/mongodb.js`

3. **Install Chart.js** (for charts):
   ```bash
   npm install chart.js
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:3000`

## 📊 Dashboard Features

### Summary Cards
- **Total Balance**: Shows current financial status
- **Total Income**: Sum of all income transactions
- **Total Expenses**: Sum of all expense transactions

### Category Breakdown
- **Top 5 Expense Categories**: With amounts and percentages
- **Top 5 Income Categories**: With amounts and percentages
- **Recent Transactions**: Latest 5 transactions with details

### Charts View
- **Monthly Overview**: Bar chart of income vs expenses
- **Expense Categories**: Pie chart showing spending distribution
- **Income Categories**: Pie chart showing income sources

## 🔧 API Endpoints

- `GET /api/transactions` - Fetch all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions` - Update existing transaction
- `DELETE /api/transactions` - Delete transaction

## 🎯 Future Enhancements

- **Budget Tracking**: Set and monitor spending limits
- **Export Features**: Download reports in PDF/CSV
- **Advanced Analytics**: Trend analysis and predictions
- **Multi-currency Support**: Handle different currencies
- **Data Backup**: Export/import functionality




