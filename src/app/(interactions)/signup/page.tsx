import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <div className="bg-gradient-to-b from-primary-light to-primary-light flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <SignupForm />
      </div>
    </div>
  )
}