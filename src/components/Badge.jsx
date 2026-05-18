export default function Badge({ children, type = "success" }) {
  const types = {
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
    primary: "bg-blue-100 text-blue-700",
    secondary: "bg-gray-100 text-gray-700",
  };

  return (
    <span className={`${types[type]} px-3 py-1 rounded-full text-sm font-medium inline-block`}>
      {children}
    </span>
  );
}