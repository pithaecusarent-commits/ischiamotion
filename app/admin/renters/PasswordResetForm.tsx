"use client";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  profileId: string;
  routeId: string;
};

export function PasswordResetForm({ action, profileId, routeId }: Props) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm("Vuoi inviare un link per reimpostare la password a questo utente?")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="profile_id" value={profileId} />
      <input type="hidden" name="route_id" value={routeId} />
      <button
        className="rounded-full border border-sea/20 bg-sea/10 px-4 py-2 text-xs font-bold text-green-deep transition hover:border-sea/40 hover:bg-sea/15"
        type="submit"
      >
        Invia reset password
      </button>
    </form>
  );
}
