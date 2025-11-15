"use server";

import { createClient } from "@/lib/supabase/server"; // We'll create this
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
const supabase = await createClient(); 

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login error:", error.message);
    return { error: "Invalid login credentials. Please try again." };
  }

  revalidatePath("/", "layout"); // Revalidate all pages
  redirect("/admin/dashboard");
}