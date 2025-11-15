"use client";

import { useFormState, useFormStatus } from "react-dom";
import { signup } from "./actions";
import Link from "next/link";
import { Home } from "lucide-react";

// ADDED: Define the shape of the state
type State = {
  message: string;
  errors?: {
    email?: string[];
    password?: string[];
  };
};

// UPDATED: Apply the new type to the initial state
const initialState: State = {
  message: "",
  errors: {},
};

function SignupButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 disabled:bg-gray-400"
    >
      {pending ? "Creating Account..." : "Create Account"}
    </button>
  );
}

export default function SignupPage() {
  // UPDATED: Pass the State type to useFormState
  const [state, formAction] = useFormState<State, FormData>(signup, initialState);

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background py-12">
      <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-xl border border-border-light">
        <div className="flex justify-center items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Home className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-text-primary">Create Account</span>
        </div>
        
        <form action={formAction} className="space-y-6">
          {state?.message && (
            <div className={`p-3 rounded-lg text-center ${
              state.message.startsWith('Success') ? 'bg-accent-success/20 text-accent-success' : 'bg-accent-error/20 text-accent-error'
            }`}>
              {state.message}
            </div>
          )}

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
            {/* This code is now type-safe */}
            {state.errors?.email && <p className="text-accent-error text-sm mt-1">{state.errors.email[0]}</p>}
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
            {/* This code is now type-safe */}
            {state.errors?.password && <p className="text-accent-error text-sm mt-1">{state.errors.password[0]}</p>}
          </div>
          
          <SignupButton />

          <p className="text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}