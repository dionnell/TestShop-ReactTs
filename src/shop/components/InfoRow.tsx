

export const InfoRow = ({
  icon: Icon,
  label,
  value,
  placeholder,
}: {
  icon: React.ElementType
  label: string
  value?: string | null
  placeholder?: string
}) => (
  <div className="flex items-start gap-3 py-3">
    <div className="mt-0.5 h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
      <Icon className="h-4 w-4 text-gray-500" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className={`text-sm font-semibold mt-0.5 ${!value ? "text-gray-400 italic" : "text-gray-900"}`}>
        {value || placeholder || "—"}
      </p>
    </div>
  </div>
)