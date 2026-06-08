import { BsDatabaseExclamation } from "react-icons/bs"; 

export default function EmptyState({ text = "Belum ada data" }) {
    return (
        <div className="p-8 text-center text-gray-400 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
            <div className="text-4xl mb-2 text-gray-300">
                <BsDatabaseExclamation />   
            </div>
            <p className="text-sm font-medium">{text}</p>
        </div>
    );
}