export default function PageHeader({ title, breadcrumb, children }) {
  return (
    <div className="flex justify-between items-end mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        <div className="text-sm text-gray-400 mt-1">
          Dashboard / {breadcrumb}
        </div>
      </div>
      <div>
        {children} {/* Slot untuk tombol "Add New" */}
      </div>
    </div>
  );
}