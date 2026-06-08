export default function AlertBox({ type = "info", children }) {
    const baseClass = "px-4 py-3 rounded-2xl mb-6 shadow-sm border text-sm transition-all animate-in fade-in duration-200"

    const styles = {
        success: "bg-green-100 border-green-200 text-green-700",
        error: "bg-red-100 border-red-200 text-red-700",
        info: "bg-blue-100 border-blue-200 text-blue-700",
    }

    return (
        <div className={`${baseClass} ${styles[type] || styles.info}`}>
            {children}
        </div>
    );
}