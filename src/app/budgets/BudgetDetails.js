"use client";

import { useSelector } from "react-redux";

// BudgetDetails component to show a budget's details
export function BudgetDetails({ budgetId }) {
    // Get this specific budget from Redux
  const budget = useSelector((state) =>
    state.budgets.find((budget) => budget.id === budgetId)
  );

// Find all transactions related to the selected categories
  const relatedTransactions = useSelector((state) => {
    return state.transactions.filter((transaction) =>
      budget.categories.some(
        (budgetCategory) => budgetCategory.name === transaction.category
      )
    );
  });

// Calculate the total dollar amount of all related transactions from each user
  const userTotals = relatedTransactions.reduce((acc, transaction) => {
    if (!acc[transaction.user]) {
      acc[transaction.user] = {
        user: transaction.user,
        total: 0,
        transactions: [],
      };
    }
    acc[transaction.user].total += transaction.amount;
    acc[transaction.user].transactions.push(transaction);
    return acc;
  }, {});

// Display each selected category and its total
  const renderedCategories = budget.categories.map((category) => (
    <p key={category.id} className="flex gap-2">
      <span>{category.name}</span>
      <span>Estimate: ${category.estimate}</span>
    </p>
  ));

// Display the total dollar amount for all related transactions of each user
  const renderedUserTotals = Object.values(userTotals).map(
    ({ user, total, transactions }) => (
      <div key={user} className="flex gap-2">
        <p>User: {user}</p>
        <p>Total: ${total}</p>
        {transactions.map((transaction) => (
          <div key={transaction.id}>
            {/* <p>Transaction ID: {transaction.id}</p>
            <p>Amount: ${transaction.amount}</p>
            <p>Date: {transaction.date}</p> */}
            <p>Category: {transaction.category}</p>
          </div>
        ))}
      </div>
    )
  );

// Get the total dollar amount that each user actually paid
  const userPaid = Object.values(userTotals).map(
    ({user, total}) => (
        <div key={user}>
            <p>User: {user}</p>
        </div>
    )
  );

  return (
    <div>
      <h4>{budget.name}</h4>
      <p>Estimated Revenue: ${budget.estimatedRevenue}</p>
      <div>
        <p>Categories:</p>
        {renderedCategories}
        {renderedUserTotals}
      </div>
    </div>
  );
}
