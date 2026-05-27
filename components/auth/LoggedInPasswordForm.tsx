type Props = {
  action: (formData: FormData) => Promise<void>;
};

export function LoggedInPasswordForm({ action }: Props) {
  return (
    <form action={action} className="mt-8 grid gap-4">
      <label className="grid gap-2 text-sm font-bold text-ink/70">
        Nuova password
        <input
          className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />
      </label>

      <label className="grid gap-2 text-sm font-bold text-ink/70">
        Conferma password
        <input
          className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none focus:border-sea/50"
          name="confirm_password"
          type="password"
          autoComplete="new-password"
          required
        />
      </label>

      <button className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white" type="submit">
        Aggiorna password
      </button>
    </form>
  );
}
