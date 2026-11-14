
import { supabase } from "../Config/supabaseClient";

export const AuthService = {
    // Регистрация нового пользователя
    async register(email, password, username) {
        const { data, error } = await supabase.auth.signUp({
            email: email.trim().toLowerCase(),
            password,
            options: {
                data: {
                    username: username.trim()
                }
            }
        });

        if (error) {
            throw error;
        }

        return data;
    },

    // Вход в аккаунт
    async login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password
        });

        if (error) {
            throw error;
        }

        return data;
    },

    // Выход из аккаунта
    async logout() {
        const { error } = await supabase.auth.signOut();

        if (error) {
            throw error;
        }
    },

    // Получение текущей сессии
    async getSession() {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
            throw error;
        }

        return data.session;
    },

    // Получение текущего пользователя
    async getUser() {
        const { data, error } = await supabase.auth.getUser();

        if (error) {
            throw error;
        }

        return data.user;
    },

    // Восстановление пароля
    async resetPassword(email) {
        const { data, error } =
            await supabase.auth.resetPasswordForEmail(
                email.trim().toLowerCase()
            );

        if (error) {
            throw error;
        }

        return data;
    },

    // Установка нового пароля
    async updatePassword(newPassword) {
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            throw error;
        }

        return data;
    }
};
