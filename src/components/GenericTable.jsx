export default function GenericTable({ columns, data, renderRow }) {
    return (
        <div className="overflow-x-auto rounded-2xl shadow-md border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="text-white bg-hijau">
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx} className="px-6 py-3 text-left font-semibold tracking-wider text-sm">
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-800">
                    {data.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                            {renderRow(item, index)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}