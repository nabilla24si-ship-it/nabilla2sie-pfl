export default function LoadingSpinner({ text = "Loading..." }) {
    return (
        <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent border-emerald-600 mb-3"></div>
            <span className="text-sm font-medium animate-pulse">{text}</span>
        </div>
    );
}