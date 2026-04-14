import { SignInForm } from "../../../components/auth/signin-form";

export default function SigninPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Sign In</h1>
      <SignInForm />
    </main>
  );
}
