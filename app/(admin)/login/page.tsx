"use client";

import { login } from "./actions";
import { useFormState, useFormStatus } from "react-dom";
import { Home } from "lucide-react";

const initialState = {
  error: "",
};

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 disabled:bg-gray-400"
    >
      {pending ? "Signing In..." : "Sign In"}
    </button>
  );
}

export default function LoginPage() {
  // Wrap the login action so it matches the signature
  const [state, formAction] = useFormState(
    async (_state: typeof initialState, formData: FormData) => {
      return login(formData); // call your original login function
    },
    initialState
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-hover">
      <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-xl border border-border-light">
        <div className="flex justify-center items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Home className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-text-primary">Admin Login</span>
        </div>
        
        <form action={formAction} className="space-y-6">
          <div>
            <label htmlFor="email" className="block font-medium text-text-primary mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full p-3 border border-border-light rounded-lg text-text-primary bg-background"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block font-medium text-text-primary mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full p-3 border border-border-light rounded-lg text-text-primary bg-background"
            />
          </div>
          
          <LoginButton />

          {state?.error && (
            <p className="text-sm text-center text-accent-error">{state.error}</p>
          )}
        </form>
      </div>
    </div>
  );
}
