"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { addUser, userAdded } from "../../lib/features/users/usersSlice";
import { nanoid } from "@reduxjs/toolkit";

// TODO: let user assign a color for the background of each user ("color" key in user object to state)

// Component to add users
export function UsersAddForm() {
  const dispatch = useDispatch();

  // User initial state
  const [name, setName] = React.useState("");

  // Update input value when changed
  const handleName = (e) => {
    setName(e.target.value);
  };

  // On submit, add user to state and reset input
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name) {
      dispatch(addUser({ name }));
      setName("");
    }
  };

  return (
    <div className="flex flex-col items-center border p-2 w-9/12 rounded">
      <h4>Add a User</h4>
      <form onSubmit={handleSubmit}>
        {/* User name */}
        <label htmlFor="userName">
          Name
          <input
            type="text"
            id="userName"
            name="userName"
            value={name}
            onChange={handleName}
            required
            className="ml-2"
          />
        </label>
        <button
          type="submit"
          className="ml-2 py-1 px-2 rounded bg-sky-500"
        >
          Add User
        </button>
      </form>
    </div>
  );
}
