import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch profile data for the logged-in user (with retry)
    const fetchProfile = async (userId) => {
        // Try up to 3 times with delay (trigger might not have finished yet)
        for (let attempt = 0; attempt < 3; attempt++) {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (data) return data;

            if (error) {
                console.warn(`Profile fetch attempt ${attempt + 1} failed:`, error.message);
            }

            // Wait before retry
            if (attempt < 2) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }

        console.error('Failed to fetch profile after 3 attempts');
        return null;
    };

    // Listen for auth state changes
    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                const profileData = await fetchProfile(session.user.id);
                setProfile(profileData);
            }
            setLoading(false);
        };

        getInitialSession();

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    const profileData = await fetchProfile(session.user.id);
                    setProfile(profileData);
                } else {
                    setProfile(null);
                }
                setLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Sign out function
    const signOut = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setProfile(null);
        setLoading(false);
    };

    const value = {
        user,
        session,
        profile,
        loading,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
