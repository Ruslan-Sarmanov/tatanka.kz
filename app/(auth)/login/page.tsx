import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="container-page py-12">
      <AuthForm mode="login" />
    </div>
  );
}
