import { selectTransaction } from "../../lib/features/transactions/transactionsSlice";
import { useSelector } from "react-redux";
import { Chart, registerables } from "chart.js";
import React from "react";
import "chartjs-adapter-moment";

// Necessary for chart.js to function
Chart.register(...registerables);

// Chart text color
Chart.defaults.color = "#FFFFFF"

// TransactionsChart component to make a chart of all transactions
export function TransactionsChart() {
  const transactions = useSelector(selectTransaction);
  // Organizes transactions by date and type and aggregates their amounts. Memoizes transactions data so it doesn't need to re-render each time
  const groupedTransactions = React.useMemo(() => {
    const grouped = {};

    // Adds the transaction amounts for each date
    transactions.forEach((transaction) => {
      const { date, type, amount } = transaction;
      if (!grouped[date]) {
        grouped[date] = {
          Expense: 0,
          Revenue: 0,
        };
      }
      grouped[date][type] += amount;
    });
    return grouped;
  }, [transactions]);

  // Aggregate the daily and cumulative transaction data. Memoize so it doesn't need to re-render for each thing
  const {
    dates,
    dailyExpenses,
    dailyRevenues,
    cumulativeExpenseAmounts,
    cumulativeRevenueAmounts,
  } = React.useMemo(() => {
    const dates = Object.keys(groupedTransactions).sort();
    const dailyExpenses = [];
    const dailyRevenues = [];
    let cumulativeExpenses = 0;
    let cumulativeRevenues = 0;
    const cumulativeExpenseAmounts = [];
    const cumulativeRevenueAmounts = [];

    dates.forEach((date) => {
      const dailyExpense = groupedTransactions[date].Expense;
      const dailyRevenue = groupedTransactions[date].Revenue;

      dailyExpenses.push(dailyExpense);
      dailyRevenues.push(dailyRevenue);

      cumulativeExpenses += dailyExpense;
      cumulativeRevenues += dailyRevenue;
      cumulativeExpenseAmounts.push(cumulativeExpenses);
      cumulativeRevenueAmounts.push(cumulativeRevenues);
    });
    return {
      dates,
      dailyExpenses,
      dailyRevenues,
      cumulativeExpenseAmounts,
      cumulativeRevenueAmounts,
    };
  }, [groupedTransactions]);

  React.useEffect(() => {
    // Create the line chart for transactions
    const ctx = document.getElementById("transactionsChart").getContext("2d");
    const lineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          // Daily Expenses line
          {
            label: "Daily Expenses",
            data: dailyExpenses,
            borderColor: "red",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderWidth: 1,
            fill: false,
          },
          // Daily Revenues line
          {
            label: "Daily Revenues",
            data: dailyRevenues,
            borderColor: "green",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 1,
            fill: false,
          },
          // Cumulative Expenses line
          {
            label: "Cumulative Expenses",
            data: cumulativeExpenseAmounts,
            borderColor: "darkred",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderWidth: 1,
            fill: false,
          },
          // Cumulative Revenues line
          {
            label: "Cumulative Revenues",
            data: cumulativeRevenueAmounts,
            borderColor: "darkgreen",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 1,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: "time",
            time: {
              unit: "day",
              tooltipFormat: "MM DD",
              displayFormats: {
                day: "MM DD",
              },
            },
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });
    return () => {
      lineChart.destroy();
    };
  }, [
    dates,
    dailyExpenses,
    dailyRevenues,
    cumulativeExpenseAmounts,
    cumulativeRevenueAmounts,
  ]);

  return <canvas id="transactionsChart"></canvas>;
}
