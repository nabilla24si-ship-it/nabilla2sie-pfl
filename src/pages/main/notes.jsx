import { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import { notesAPI } from "../../services/notesAPI";

import { AiFillDelete } from "react-icons/ai";


import GenericTable from "../../components/GenericTable";
import AlertBox from "../../components/AlertBox";
import EmptyState from "../../components/EmptyState";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function Notes() {

    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    
    const [dataForm, setDataForm] = useState({
        title: "", content: "", status: ""
    });

    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await notesAPI.fetchNotes();
            setNotes(data);
        } catch (err) {
            setError("Gagal memuat catatan");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Mengontrol input teks pada Form
    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setDataForm({
            ...dataForm,
            [name]: value,
        });
    };

    // Handle form submission untuk createData ke REST API beserta Success dan Error Info
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            await notesAPI.createNote(dataForm);

            setSuccess("Catatan berhasil ditambahkan!");

            // Kosongkan Form setelah Success
            setDataForm({ title: "", content: "", status: "" });

            // Hilangkan pesan Success setelah 3 detik
            setTimeout(() => setSuccess(""), 3000);
            
            // Panggil Ulang loadNotes untuk refresh data
            loadNotes();
            
        } catch (err) {
            setError(`Terjadi kesalahan: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // 7️⃣ Handle untuk aksi hapus data
    const handleDelete = async (id) => {
        const konfirmasi = confirm("Yakin ingin menghapus catatan ini?");
        if (!konfirmasi) return;

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            await notesAPI.deleteNote(id);

            // Refresh data setelah berhasil dihapus
            loadNotes();
        } catch (err) {
            setError(`Terjadi kesalahan: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="dashboard-container">
            <PageHeader title="Notes" />

            {/* Container Layout Vertikal Berurutan ke Bawah */}
            <div className="max-w-2xl mx-auto p-6 space-y-6">
                
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Notes App
                    </h2>
                </div>

                {/* Menampilkan Alert Box Dinamis */}
                {error && <AlertBox type="error">{error}</AlertBox>}
                {success && <AlertBox type="success">{success}</AlertBox>}

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Tambah Catatan Baru
                    </h3>

                    {/* Terapkan onSubmit pada Form, disable semua inputan, dan ubah teks tombol saat Loading */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="title"
                            value={dataForm.title}
                            placeholder="Judul catatan"
                            onChange={handleChange}
                            required
                            disabled={loading} // Men-disable saat loading
                            className="w-full p-3 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none
                                focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all
                                duration-200 disabled:opacity-50"
                        />

                        <textarea
                            name="content"
                            value={dataForm.content}
                            placeholder="Isi catatan"
                            onChange={handleChange}
                            required
                            rows="2"
                            disabled={loading} // Men-disable saat loading
                            className="w-full p-3 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none
                                focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all
                                duration-200 resize-none disabled:opacity-50"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold
                                rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500
                                focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
                                transition-all duration-200 shadow-lg"
                        >
                            {/* Mengubah Teks Tombol saat Loading */}
                            {loading ? "Mohon Tunggu..." : "Tambah Data"}
                        </button>
                    </form>
                </div>

                {loading && <LoadingSpinner text="Memuat catatan..." />}

                {!loading && notes.length === 0 && !error && (
                    <EmptyState text="Belum ada catatan. Tambah catatan pertama!" />
                )}

                {!loading && notes.length === 0 && error && (
                    <EmptyState text="Terjadi Kesalahan. Coba lagi nanti." />
                )}
                
                {!loading && notes.length > 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mt-10">
                        <div className="px-6 py-4">
                            <h3 className="text-lg font-semibold">
                                Daftar Catatan ({notes.length})
                            </h3>
                        </div>
                      
                        <GenericTable
                            columns={["#", "Judul", "Isi Catatan", "Aksi"]} // Tambah kolom baru "Aksi"
                            data={notes}
                            renderRow={(note, index) => (
                                <>
                                    <td className="px-6 py-4 font-medium text-gray-700">
                                        {index + 1}.
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-emerald-600">
                                            {note.title}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <div className="truncate text-gray-600">
                                            {note.content}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <div className="truncate text-gray-600">
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(note.id)}
                                                disabled={loading}
                                                className="focus:outline-none disabled:opacity-50"
                                            >
                                                <AiFillDelete className="text-red-400 text-2xl hover:text-red-600 transition-colors" />
                                            </button>
                                        </div>
                                    </td>
                                </>
                            )}
                        />
                    </div>
                ) : null}

            </div>
        </div>
    );
}