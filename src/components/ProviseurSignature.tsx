export default function ProviseurSignature() {
  return (
    <div className="mt-8 space-y-2 text-sm text-slate-600">
      <p className="font-medium text-slate-700">Le Proviseur</p>
      <svg
        className="h-16 w-40 text-slate-500"
        viewBox="0 0 200 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 60 C 30 20, 60 20, 75 55 C 85 75, 105 40, 120 50 C 135 60, 150 45, 170 55"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M32 48 C 38 42, 45 42, 52 52"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M132 52 C 138 42, 150 40, 158 50"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="text-xs uppercase tracking-wide text-slate-400">Signature</p>
    </div>
  );
}
