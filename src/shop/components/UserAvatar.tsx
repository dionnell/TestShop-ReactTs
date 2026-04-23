
export const UserAvatar = ({ fullName }: { fullName: string }) => {
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
 
  return (
    <div className="h-20 w-20 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
      <span className="text-white text-2xl font-bold tracking-wide">{initials}</span>
    </div>
  )
}