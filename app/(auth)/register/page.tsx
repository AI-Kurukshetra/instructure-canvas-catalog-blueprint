import AuthForm from "@/components/auth/auth-form";
import { signUp } from "@/app/(auth)/actions";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Create account",
};

const RegisterPage = async () => {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  if (data.user) redirect("/dashboard");

  return (
    <AuthForm
      heading="Create your account"
      description="Start learning with access to the course catalog and track your progress."
      submitLabel="Create account"
      alternateHref="/login"
      alternateLabel="Already have an account?"
      alternateLinkText="Sign in"
      passwordAutoComplete="new-password"
      action={signUp}
    />
  );
};

export default RegisterPage;
