"use client";

import { budgetEdited } from "../../lib/features/budget/budgetSlice";
import { useDispatch, useSelector } from "react-redux";

// BudgetDetails component to show a budget's details
export function BudgetDetails({ budgetId }) {
  const dispatch = useDispatch();
  // Get this specific budget from Redux
  const budget = useSelector((state) =>
    state.budgets.find((budget) => budget.id === budgetId)
  );

  // Find all transactions related to all selected categories
  const relatedTransactions = useSelector((state) => {
    return state.transactions.filter((transaction) =>
      budget.categories.some((budgetCategory) => {
        return budgetCategory.name === transaction.category;
      })
    );
  });

  // Error handling if budget not found
  if (!budget) {
    return <div>Budget Not Found</div>;
  }

  // Calculate the sum of all category estimates
  let totalCategoriesEstimate = 0;
  budget.categories.forEach(
    (category) => (totalCategoriesEstimate += category.estimate)
  );

  // Calculate the total dollar amount of all related expenses and revenues
  const typeTotals = relatedTransactions.reduce((acc, transaction) => {
    if (!acc[transaction.type]) {
      acc[transaction.type] = {
        type: transaction.type,
        total: 0,
        transactions: [],
      };
    }
    acc[transaction.type].total += transaction.amount;
    acc[transaction.type].transactions.push(transaction);
    return acc;
  }, {});

  // Calculate total actual expenses
  const expensesTotalActual = typeTotals["Expense"]
    ? typeTotals["Expense"].total
    : 0;

  let allUsersPaidActual = 0;
  let numUsers = budget.users.length;

  // Calculate the total dollar amount of all related transactions from each user
  const userTotals = relatedTransactions.reduce((acc, transaction) => {
    // Calculate totals for all users as long as they are part of the budget's selected users
    if (budget.users.some((user) => user.name === transaction.user)) {
      if (!acc[transaction.user]) {
        acc[transaction.user] = {
          user: transaction.user,
          total: 0,
          estimate: 0,
          transactions: [],
        };
      }

      acc[transaction.user].total += transaction.amount;
      acc[transaction.user].transactions.push(transaction);
      allUsersPaidActual += transaction.amount;
    }
    return acc;
  }, {});

  // Calculate how much actual expenses exceeded or fell short of estimate
  const overUnderEst = expensesTotalActual - totalCategoriesEstimate;

  // Calculate how much to adjust each user's estimate after the actual expenses total
  let adjustmentPerUser = overUnderEst / numUsers;

  // User info of their estimates
  const userEstimates = budget.users.map((user) => {
    const newEstimate = user.estimate + adjustmentPerUser;
    return {
      id: user.id,
      name: user.name,
      originalEstimate: user.estimate,
      newEstimate,
    };
  });

  // Display each selected category and its estimate
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
        <p>Actual Paid: ${total}</p>
        {transactions.map((transaction) => (
          <div key={transaction.id}>
            <p>Category: {transaction.category}</p>
          </div>
        ))}
      </div>
    )
  );

  const overbudgetStyle = "text-red-600";
  const underbudgetStyle = "text-green-600";

  // For each user, show their estimate, adjusted estimate, actual paid, and how much they still owe
  const renderedUserEstimates = userEstimates.map((userEstimate) => {
    const actualPaid = userTotals[userEstimate.name]?.total || 0;
    const stillOwes = userEstimate.newEstimate - actualPaid;
    const formattedStillOwes =
    stillOwes > 0 ? (
      <p> Still Owes: 
        <span className={overbudgetStyle}>
          {" $"}
          {stillOwes}
          {""}
        </span>
      </p>
    ) : (
      <p> Is Owed: 
        <span className={underbudgetStyle}>
          {" $"}
          {Math.abs(stillOwes)}
        </span>
      </p>
    );
    return (
      <div key={userEstimate.id} className="flex gap-2 border ml-5">
        <p>
          {userEstimate.name} Estimate: ${userEstimate.originalEstimate},
        </p>
        <p>Adjusted Owes: ${userEstimate.newEstimate},</p>
        <p>Actual Paid: ${actualPaid},</p>
        {formattedStillOwes}
      </div>
    );
  });

  // Display the total dollar amount for all related transactions of expenses and revenues
  const renderedTypeTotals = Object.values(typeTotals).map(
    ({ type, total }) => (
      <div key={type} className="flex gap-2">
        <p>Type: {type},</p>
        <p>Total: ${total}</p>
      </div>
    )
  );

  // Alert message if user set overbudget alert
  const overbudget = budget.alertOverbudget && overUnderEst > 0 && (
    <span className="bg-orange-500 text-white py-1 px-2 rounded">
      Overbudget!
    </span>
  );

  // Alert message if user set an alert for if expenses exceed a certain amount
  const overbudgetAmount = budget.alertOverAmount &&
    expensesTotalActual > budget.alertAmount && (
      <span className="bg-orange-500 text-white py-1 px-2 rounded">
        Over Amount of ${budget.alertAmount}!
      </span>
    );

  if (budget.alertOverbudget && overUnderEst > 0) {
    dispatch(budgetEdited({ ...budget, overbudget: true }));
  } else if (!(budget.alertOverbudget && overUnderEst > 0)) {
    dispatch(budgetEdited({ ...budget, overbudget: false }));
  }

  const formattedOverUnderBudget =
    overUnderEst > 0 ? (
      <span className={overbudgetStyle}>
        {"$("}
        {overUnderEst}
        {")"}
      </span>
    ) : (
      <span className={underbudgetStyle}>
        {"$"}
        {overUnderEst}
      </span>
    );

    const formattedUserBudget =
    overUnderEst > 0 ? (
      <span className={overbudgetStyle}>
        {"$("}
        {adjustmentPerUser}
        {")"}
      </span>
    ) : (
      <span className={underbudgetStyle}>
        {"$"}
        {adjustmentPerUser}
      </span>
    );

  return (
    <div className="flex items-center justify-center">
      <div>
        <h3 className="mt-5">{budget.name}</h3>
        <div className="my-3 flex gap-2">
          {overbudget}
          {overbudgetAmount}
        </div>
        {/* <p>Estimated Revenue: ${budget.estimatedRevenue}</p> */}
        <div>
          {/* <p>Categories:</p> */}
          {/* {renderedCategories} */}
          {renderedTypeTotals}
          <p>
            Total Paid: $
            {Object.values(userTotals).reduce(
              (sum, user) => sum + user.total,
              0
            )}
          </p>
          <p>Total Estimate (Regularly Paid): ${totalCategoriesEstimate}</p>
          <p>Actual Expenses Due: ${expensesTotalActual}</p>
          <p>
            Over/(Under) Budget: {formattedOverUnderBudget}. Adjustment per
            user: {formattedUserBudget}
          </p>
          <p>Still Owed: ${expensesTotalActual - allUsersPaidActual}</p>
          <p>User Estimates:</p>
          {renderedUserEstimates}
        </div>
      </div>
    </div>
  );
}
