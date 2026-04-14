
import * as SignupFormModule from '../../../components/auth/signup-form';
const SignUpForm = SignupFormModule.SignUpForm;

export default function SignupPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
      <SignUpForm />
    </main>
  );
}
