import { PasswordUpdateForm } from "@/components/auth/PasswordUpdateForm";

export default function UpdatePasswordPage() {
  return (
    <main className="min-h-screen bg-sand p-6 text-ink">
      <section className="mx-auto max-w-md rounded-[30px] bg-cream p-8 shadow-soft">
        <p className="section-kicker">Accesso</p>
        <h1 className="mt-3 font-serif text-4xl font-bold">Nuova password</h1>
        <p className="mt-4 text-ink/65">Imposta una nuova password per il tuo account IschiaMotion.</p>
        <PasswordUpdateForm />
      </section>
    </main>
  );
}
