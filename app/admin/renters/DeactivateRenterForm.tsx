"use client";

type Props = {
  profileId: string;
  action: (formData: FormData) => void | Promise<void>;
};

export function DeactivateRenterForm({ profileId, action }: Props) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm("Sei sicuro di voler disattivare questo renter?")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="profile_id" value={profileId} />
      <button className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700" type="submit">
        Disattiva
      </button>
    </form>
  );
}
