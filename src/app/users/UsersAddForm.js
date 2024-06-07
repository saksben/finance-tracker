"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { userAdded } from "../../lib/features/users/usersSlice";
import { nanoid } from "@reduxjs/toolkit";

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
  const handleSubmit = (e) => {
    if (name !== "") {
      e.preventDefault();
      dispatch(
        userAdded({
          id: nanoid(),
          name: name,
        })
      );
      setName("");
    }
  };

  return (
    <div>
      <h4>Add a User</h4>
      <form>
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
          />
        </label>
        <button
          type="button"
          onClick={handleSubmit}
          className="py-1 px-2 bg-sky-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
