"use client";

import {
  deleteUser,
  fetchUsers,
  selectUsers,
} from "../../lib/features/users/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import { UsersAddForm } from "./UsersAddForm";
import { useRouter } from "next/navigation";
import React from "react";

// UsersList component to display all users
export function UsersList() {
  const dispatch = useDispatch();
  const router = useRouter();

  // Select users from store
  const users = useSelector(selectUsers);
  const userStatus = useSelector((state) => state.users.status)

  const handleDelete = async (id) => {
    dispatch(deleteUser(id));
  };

  React.useEffect(() => {
    if (userStatus === 'idle') {
      dispatch(fetchUsers());
    }
    
  }, [userStatus, dispatch]);

  return (
    <section className="flex flex-col gap-2 items-center mt-3">
      <h2>Users</h2>
      <UsersAddForm />
      {users.map((user) => (
        <article key={user.id} className="flex gap-2 items-center">
          <p>{user.name}</p>
          <button
            onClick={() => router.push(`/users/edit/${user.id}`)}
            className="py-1 px-2 bg-slate-500 rounded"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(user.id)}
            className="py-1 px-2 bg-red-600 rounded"
          >
            Delete
          </button>
        </article>
      ))}
    </section>
  );
}
