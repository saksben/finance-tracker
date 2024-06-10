"use client";

import { useParams } from "next/navigation";
import { BudgetsEditForm } from "../../BudgetsEditForm";

// Budget edit page
export default function BudgetEdit() {
    const params = useParams()
    const budgetId = params.id
  return <BudgetsEditForm budgetId={budgetId}/>;
}
