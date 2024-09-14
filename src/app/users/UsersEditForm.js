"use client";

import {
  fetchUserById,
  updateUser,
} from "../../lib/features/users/usersSlice";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

// UsersEditForm component to update user
export function UsersEditForm({ id }) {
  console.log("Editing user with ID: ", id);

  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state) => {
    return state.users.users.find((user) => user.id === id);
  });

  const userStatus = useSelector((state) => state.users.status);

  // Input state
  const [name, setName] = React.useState("");

  React.useEffect(() => {
    if (userStatus === "idle" || (!user && userStatus !== "loading")) {
      dispatch(fetchUserById(id));
    } else if (user) {
      setName(user.name);
    }
  }, [dispatch, id, user, userStatus]);

  // Input change handler
  const handleNameChange = (e) => setName(e.target.value);

  // On save, update this user in store and go back to users page
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUser({ id, name })).unwrap();
      router.push("/users");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (userStatus === "loading") return <div>Loading...</div>;
  if (userStatus === "failed") return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-2 items-center mt-3">
      <h4>Edit User</h4>
      <form onSubmit={handleSave}>
        {/* User name */}
        <label htmlFor="userName">
          Name
          <input
            type="text"
            id="userName"
            name="userName"
            value={name}
            onChange={handleNameChange}
            required
            className="ml-2 px-2"
          />
        </label>
        <button type="submit" className="ml-2 py-1 px-2 rounded bg-sky-500">
          Submit
        </button>
      </form>
    </div>
  );
}
