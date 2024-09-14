"use client";

import { useParams } from "next/navigation";
import { UsersEditForm } from "../../UsersEditForm";

// Page for editing user
export default function EditUser() {
  // Get the user's id from the url params and pass it to the edit form to specify the user
  const params = useParams();
  const userId = parseInt(params.id);

  return userId ? <UsersEditForm id={userId} /> : <p>User Not Found</p>;
}
