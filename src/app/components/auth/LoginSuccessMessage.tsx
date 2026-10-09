interface LoginSuccessMessageProps {
  message: string;
}

export default function LoginSuccessMessage({
  message,
}: LoginSuccessMessageProps) {
  return (
    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
      ✓ {message}
    </div>
  );
}