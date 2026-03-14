"use server";

import { z } from "zod";
import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

const credentialsSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
});

export type AuthActionState = {
  status: "idle" | "error";
  message?: string;
};

const parseCredentials = (formData: FormData) =>
  credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

export const signIn = async (
  _prevState: void | AuthActionState,
  formData: FormData,
): Promise<void | AuthActionState> => {
  const parsed = parseCredentials(formData);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message } satisfies AuthActionState;
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { status: "error", message: error.message } satisfies AuthActionState;
  }

  redirect("/dashboard");
};

export const signUp = async (
  _prevState: void | AuthActionState,
  formData: FormData,
): Promise<void | AuthActionState> => {
  const parsed = parseCredentials(formData);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message } satisfies AuthActionState;
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signUp(parsed.data);

  if (error) {
    return { status: "error", message: error.message } satisfies AuthActionState;
  }

  redirect("/dashboard");
};

export const signOut = async () => {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/");
};
