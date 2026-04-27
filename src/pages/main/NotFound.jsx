import { Link } from "react-router-dom";

export default function NotFound({ 
  code = "404", 
  message = "Oops, This Page Could Not Be Found", 
  description = "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] text-center p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
      
      {/* Gambar dari public/img/ */}
      <div className="mb-8">
        <img 
          src="/img/error.jpg" // Mengarah ke public/img/404.png sesuai letak file kamu
          alt="Error Illustration" 
          className="w-80 h-auto object-contain mx-auto"
        />
      </div>

      {/* Teks Error sesuai desain yang kamu mau */}
      <h1 className="text-4xl font-black text-gray-800 mb-4 tracking-tight">
        {message}
      </h1>
      
      <p className="text-gray-400 max-w-md mx-auto mb-10 leading-relaxed text-sm">
        {description}
      </p>

      {/* Tombol Back to Dashboard */}
      <Link 
        to="/" 
        className="bg-hijau text-white px-12 py-4 rounded-full font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100 active:scale-95"
      >
        Back to Dashboard
      </Link>
      
      {/* Footer Kode Error */}
      <div className="mt-8 pt-6 border-t border-gray-50 w-full max-w-xs text-[10px] font-mono text-gray-300 uppercase tracking-[0.2em]">
        System Response: {code} Error
      </div>
    </div>
  );
}