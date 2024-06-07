"use client";

import { userEdited } from "../../lib/features/users/usersSlice";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

// UsersEditForm component to update user
export function UsersEditForm({ userId }) {
  const dispatch = useDispatch();
  const router = useRouter();

  // Get the specific user from state by its id
  const user = useSelector((state) =>
    state.users.find((user) => user.id === userId)
  );

  // Input state
  const [name, setName] = React.useState(user.name);

  // Input change handler
  const handleNameChange = (e) => setName(e.target.value);

  // On save, update this user in store and go back to users page
  const handleSave = () => {
    if (name) {
      dispatch(
        userEdited({
          id: userId,
          name: name,
        })
      );
    }
    router.push("/users");
  };

  return (
    <div>
      <h4>Edit User</h4>
      <form>
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
          />
        </label>
        <button
          type="button"
          onClick={handleSave}
          className="py-1 px-2 bg-sky-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
