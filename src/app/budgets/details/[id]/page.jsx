"use client";

import { useParams } from "next/navigation";
import { BudgetDetails } from "../../BudgetDetails";

// Budget details page
export default function DetailsPage() {
  // Get id from url params and use it to pass the id for the specific budget
  const params = useParams();
  const budgetId = params.id;

  return (
    <>
      <BudgetDetails budgetId={budgetId} />
    </>
  );
}
