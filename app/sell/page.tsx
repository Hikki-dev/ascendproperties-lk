"use server";

type LeadState = {
  message: string;
  errors: Record<string, string>;
};

export async function submitLead(
  prevState: LeadState,
  formData: FormData
): Promise<LeadState> {
  const full_name = formData.get("full_name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();
  const lead_type = formData.get("lead_type")?.toString();
  const message = formData.get("message")?.toString() || "";

  const errors: Record<string, string> = {};

  // Validation
  if (!full_name) errors.full_name = "Full name is required";
  if (!email) errors.email = "Email is required";
  if (!phone) errors.phone = "Phone number is required";

  if (Object.keys(errors).length > 0) {
    return {
      message: "Please correct the errors below.",
      errors,
    };
  }

  // Save lead into database (example)
  // await db.insert(...)

  return {
    message: "Success!",
    errors: {},
  };
}
