"use client";

type Props = {
  children: React.ReactNode;
  className: string;
  message: string;
  disabled?: boolean;
};

export function ConfirmSubmitButton({ children, className, message, disabled = false }: Props) {
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
      type="submit"
    >
      {children}
    </button>
  );
}
