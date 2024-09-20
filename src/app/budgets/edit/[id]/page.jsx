"use client";

import { useParams } from "next/navigation";
import { BudgetsEditForm } from "../../BudgetsEditForm";

// Budget edit page
export default function BudgetEdit() {
    const params = useParams()
    const budgetId = parseInt(params.id)
  return <BudgetsEditForm budgetId={budgetId}/>;
}
