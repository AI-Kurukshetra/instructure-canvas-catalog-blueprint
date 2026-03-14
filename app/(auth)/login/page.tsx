import AuthForm from "@/components/auth/auth-form";
import { signIn } from "@/app/(auth)/actions";

export const metadata = {
  title: "Sign in",
};

const LoginPage = () => (
  <AuthForm
    heading="Welcome back"
    description="Sign in to access your courses, track progress, and continue learning."
    submitLabel="Sign in"
    alternateHref="/register"
    alternateLabel="New here?"
    alternateLinkText="Create an account"
    passwordAutoComplete="current-password"
    action={signIn}
  />
);

export default LoginPage;
