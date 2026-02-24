export default function PercentageBadge({
  value,
}: {
  value: number;
}) {
  let color = "bg-red-100 text-red-700";

  if (value >= 80) {
    color = "bg-green-100 text-green-700";
  } else if (value >= 50) {
    color = "bg-yellow-100 text-yellow-700";
  }

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}
    >
      {value}%
    </span>
  );
}
