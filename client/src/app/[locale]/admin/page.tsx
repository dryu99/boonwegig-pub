"use client";

import { authAdmin } from "@/lib/actions";
import { FormEvent, useState } from "react";

export default function AdminPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const password = e.currentTarget.password.value;
    const authResult = await authAdmin(password);
    setIsAuthorized(authResult);
  };

  return (
    <div>
      {!isAuthorized ? (
        <form onSubmit={submitForm}>
          <div className="mt-4">
            <label htmlFor="password">Password</label>
            <div className="text-black">
              <input id="password" type="password" name="password" required />
            </div>
          </div>
        </form>
      ) : (
        <div>authorized</div>
      )}
    </div>
  );
}
