import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from 'react';

import { supabase } from '../Config/supabaseClient';
import { ProfileService } from '../Services/ProfileService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileLoading, setProfileLoading] = useState(false);

    useEffect(() => {
        let mounted = true;

        async function loadSession() {
            const { data, error } = await supabase.auth.getSession();
            if (!mounted) return;

            if (error) console.error('Ошибка проверки сессии:', error.message);
            setSession(data?.session ?? null);
            setUser(data?.session?.user ?? null);
            setLoading(false);
        }

        loadSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, newSession) => {
                if (!mounted) return;
                setSession(newSession);
                setUser(newSession?.user ?? null);
                if (!newSession?.user) setProfile(null);
                setLoading(false);
            }
        );

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const refreshProfile = async () => {
        if (!user?.id) {
            setProfile(null);
            return null;
        }

        setProfileLoading(true);
        try {
            const result = await ProfileService.getProfile(user.id);
            setProfile(result);
            return result;
        } catch (error) {
            console.error('Ошибка загрузки профиля:', error.message);
            throw error;
        } finally {
            setProfileLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            refreshProfile().catch(() => {});
        } else {
            setProfile(null);
        }
    }, [user?.id]);

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Ошибка выхода из аккаунта:', error.message);
            return { error };
        }
        setProfile(null);
        return { error: null };
    };

    const value = {
        user,
        session,
        profile,
        profileLoading,
        refreshProfile,
        loading,
        isAuthenticated: !!user,
        signOut
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth должен использоваться внутри AuthProvider');
    }
    return context;
}
