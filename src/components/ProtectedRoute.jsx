import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

export default function ProtectedRoute({ requiredRole }) {
    const { session, profile, loading } = useAuth();

    // Show loading spinner while checking auth state or fetching profile
    if (loading) {
        return <Loading />;
    }

    // Redirect to login if no session
    if (!session) {
        return <Navigate to="/login" replace />;
    }

    // If session exists but profile couldn't be loaded (RLS issue or missing row)
    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-2xl shadow-md max-w-md text-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
                    <p className="text-gray-500 mb-4">
                        Your account exists but no profile data was found.
                        Please make sure you have run the SQL schema in Supabase
                        and that the <code className="bg-gray-100 px-1 rounded text-sm">on_auth_user_created</code> trigger is working.
                    </p>
                    <p className="text-sm text-gray-400 mb-4">
                        Check browser console (F12) for error details.
                    </p>
                    <a href="/login" className="inline-block bg-hijau text-white px-6 py-2 rounded-xl font-semibold">
                        Back to Login
                    </a>
                </div>
            </div>
        );
    }

    // Check role requirement
    if (requiredRole && profile.role !== requiredRole) {
        if (profile.role === 'Admin') {
            return <Navigate to="/" replace />;
        }
        if (profile.role === 'Member') {
            return <Navigate to="/member/orders" replace />;
        }
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
