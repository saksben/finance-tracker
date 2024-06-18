"use client"

import { selectUser, userRemoved } from "../../lib/features/users/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import { UsersAddForm } from "./UsersAddForm";
import { useRouter } from "next/navigation";

// UsersList component to display all users
export function UsersList() {
    const dispatch = useDispatch()
    const router = useRouter()
    
  // Select users from store
  const users = useSelector(selectUser);

  // Create a user for each one existing in state
  const renderedUsers = users.map((user) => {
    // Edit button handler, edit user with this id from state
    const handleEdit = () => {
      router.push(`/users/edit/${user.id}`);
    };

    // Delete Button handler, delete user with this id from state
    const handleDelete = () => {
      dispatch(
        userRemoved({
          id: user.id,
        })
      );
    };

    return (
      <article key={user.id} className="flex gap-2 items-center">
        <p>{user.name}</p>
        <button className="py-1 px-2 bg-slate-500 rounded" onClick={handleEdit}>
          Edit
        </button>
        <button className="py-1 px-2 bg-red-600 rounded" onClick={handleDelete}>
          Delete
        </button>
      </article>
    );
  });

  return (
    <section className="flex flex-col gap-2 items-center mt-3">
      <h2>Users</h2>
      <UsersAddForm />
      {renderedUsers}
    </section>
  );
}
