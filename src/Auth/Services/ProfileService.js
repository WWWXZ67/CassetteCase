
import { supabase } from '../Config/supabaseClient';

const TABLE = 'user_profiles';
const AVATAR_BUCKET = 'avatars';


// Преобразование Base64 в ArrayBuffer
function base64ToArrayBuffer(base64) {
    const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    const cleanBase64 = base64.replace(/[^A-Za-z0-9+/]/g, '');

    const bytes = new Uint8Array(
        Math.floor(cleanBase64.length * 3 / 4)
    );

    let buffer = 0;
    let bits = 0;
    let index = 0;

    for (let i = 0; i < cleanBase64.length; i++) {
        const value = chars.indexOf(cleanBase64[i]);

        if (value === -1) continue;

        buffer = (buffer << 6) | value;
        bits += 6;

        if (bits >= 8) {
            bits -= 8;
            bytes[index++] = (buffer >> bits) & 255;
            buffer &= (1 << bits) - 1;
        }
    }

    return bytes.buffer.slice(
        bytes.byteOffset,
        bytes.byteOffset + index
    );
}


export const ProfileService = {

    async getProfile(userId) {
        if (!userId) return null;

        const { data, error } = await supabase
            .from(TABLE)
            .select(`
                id,
                first_name,
                last_name,
                username,
                avatar_url,
                bio,
                created_at,
                updated_at
            `)
            .eq('id', userId)
            .maybeSingle();

        if (error) throw error;

        return data;
    },


    async saveProfile({
        userId,
        firstName,
        lastName,
        username,
        bio,
        avatarBase64,
        avatarMimeType,
        avatarFileName,
        currentAvatarUrl,
    }) {

        if (!userId) {
            throw new Error('Пользователь не авторизован.');
        }

        const normalizedUsername = username
            .trim()
            .replace(/^@/, '')
            .toLowerCase();

        if (!/^[a-z0-9_]{3,20}$/.test(normalizedUsername)) {
            throw new Error(
                'Ник должен содержать 3–20 символов: латинские буквы, цифры или _.'
            );
        }


        // Сохраняем старую фотографию,
        // если новая не выбрана.

        let avatarUrl = currentAvatarUrl || null;


        // Загрузка новой фотографии

        if (avatarBase64) {

            const fileData = base64ToArrayBuffer(avatarBase64);

            if (!fileData.byteLength) {
                throw new Error(
                    'Не удалось подготовить выбранную фотографию.'
                );
            }


            const mimeType = avatarMimeType || 'image/jpeg';

            const mimeExtensions = {
                'image/jpeg': 'jpg',
                'image/jpg': 'jpg',
                'image/png': 'png',
                'image/webp': 'webp',
                'image/heic': 'heic',
                'image/heif': 'heif',
            };

            const originalExtension = avatarFileName
                ?.split('.')
                .pop()
                ?.toLowerCase();

            const allowedExtensions = [
                'jpg',
                'jpeg',
                'png',
                'webp',
                'heic',
                'heif',
            ];

            const extension = allowedExtensions.includes(originalExtension)
                ? originalExtension
                : mimeExtensions[mimeType] || 'jpg';


            const filePath =
                `${userId}/avatar-${Date.now()}.${extension}`;


            // Загружаем бинарные данные в Supabase Storage

            const { error: uploadError } = await supabase.storage
                .from(AVATAR_BUCKET)
                .upload(filePath, fileData, {
                    contentType: mimeType,
                    upsert: false,
                    cacheControl: '3600',
                });

            if (uploadError) {
                console.error(
                    'Ошибка загрузки фотографии:',
                    uploadError
                );

                throw uploadError;
            }


            // Получаем публичную ссылку

            const { data: publicData } = supabase.storage
                .from(AVATAR_BUCKET)
                .getPublicUrl(filePath);

            avatarUrl = publicData.publicUrl;
        }


        // Сохраняем данные профиля

        const { data, error } = await supabase
            .from(TABLE)
            .upsert({
                id: userId,
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                username: normalizedUsername,
                avatar_url: avatarUrl,
                bio: bio.trim(),
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'id',
            })
            .select(`
                id,
                first_name,
                last_name,
                username,
                avatar_url,
                bio,
                created_at,
                updated_at
            `)
            .single();

        if (error) {
            if (error.code === '23505') {
                throw new Error(
                    'Этот ник уже занят. Придумайте другой.'
                );
            }

            throw error;
        }


        // Обновляем метаданные Supabase Auth

        const { error: authError } = await supabase.auth.updateUser({
            data: {
                first_name: data.first_name,
                last_name: data.last_name,

                full_name: [
                    data.first_name,
                    data.last_name,
                ].filter(Boolean).join(' '),

                username: data.username,
                avatar_url: data.avatar_url,
            },
        });

        if (authError) {
            console.warn(
                'Не удалось обновить метаданные профиля:',
                authError.message
            );
        }

        return data;
    },
};
