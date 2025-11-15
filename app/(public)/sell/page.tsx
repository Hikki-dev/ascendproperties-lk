"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitLead } from "./actions"; // Import the Server Action
import Link from "next/link";
import { Home, Phone, Mail, MapPin } from "lucide-react";

// Initial state for the form
const initialState = {
  message: "",
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 disabled:bg-gray-400"
    >
      {pending ? "Submitting..." : "Send Request"}
    </button>
  );
}

export default function SellPage() {
  const [state, formAction] = useFormState(submitLead, initialState);

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 md:p-8 my-12">
        <div className="bg-card p-8 md:p-12 rounded-2xl shadow-lg border border-border-light">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Sell or Rent Your Property
          </h1>
          <p className="text-lg text-text-secondary mb-8">
            Fill out the form below, and one of our expert agents will contact you for a free, no-obligation valuation.
          </p>

          <form action={formAction} className="space-y-6">
            {/* Form Status Message */}
            {state?.message && (
              <div className={`p-4 rounded-lg ${
                state.message.startsWith('Success') ? 'bg-accent-success/20 text-accent-success' : 'bg-accent-error/20 text-accent-error'
              }`}>
                {state.message}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label htmlFor="full_name" className="block font-medium text-text-primary mb-2">Full Name</label>
                <input type="text" name="full_name" id="full_name" className="w-full p-3 border border-border-light rounded-lg text-text-primary bg-background" />
                {state.errors?.full_name && <p className="text-accent-error text-sm mt-1">{state.errors.full_name[0]}</p>}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block font-medium text-text-primary mb-2">Phone Number</label>
                <input type="tel" name="phone" id="phone" className="w-full p-3 border border-border-light rounded-lg text-text-primary bg-background" />
                {state.errors?.phone && <p className="text-accent-error text-sm mt-1">{state.errors.phone[0]}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block font-medium text-text-primary mb-2">Email Address</label>
              <input type="email" name="email" id="email" className="w-full p-3 border border-border-light rounded-lg text-text-primary bg-background" />
              {state.errors?.email && <p className="text-accent-error text-sm mt-1">{state.errors.email[0]}</p>}
            </div>

            {/* Lead Type */}
            <div>
              <label htmlFor="lead_type" className="block font-medium text-text-primary mb-2">I want to...</label>
              <select name="lead_type" id="lead_type" className="w-full p-3 border border-border-light rounded-lg text-text-primary bg-background">
                <option value="sale">Sell my property</option>
                <option value="rent">Rent out my property</option>
                <option value="other">Get a valuation / Other</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block font-medium text-text-primary mb-2">Property Details (Optional)</label>
              <textarea name="message" id="message" rows={4} className="w-full p-3 border border-border-light rounded-lg text-text-primary bg-background" placeholder="e.g., 3-bedroom house in Colombo 5, approx. 1500 sqft..."></textarea>
            </div>

            <SubmitButton />
          </form>
        </div>
      </main>
    </div>
  );
}