
import React, { useEffect, useState } from 'react';

import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    Pressable,
    Alert,
    Image,
    ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import ButtonBack from '../../components/Button/3/ButtonBack';
import { useAuth } from '../../Auth/Context/AuthContext';
import { ProfileService } from '../../Auth/Services/ProfileService';
import { useTheme } from '../../theme';


export default function EditProfileScr({ navigation }) {
    const { user, profile, refreshProfile } = useAuth();
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');

    const [avatarUri, setAvatarUri] = useState(null);
    const [avatarBase64, setAvatarBase64] = useState(null);
    const [avatarMimeType, setAvatarMimeType] = useState(null);
    const [avatarFileName, setAvatarFileName] = useState(null);

    const [avatarUrl, setAvatarUrl] = useState(null);
    const [saving, setSaving] = useState(false);


    useEffect(() => {
        setFirstName(
            profile?.first_name ??
            user?.user_metadata?.first_name ??
            user?.user_metadata?.name ??
            ''
        );

        setLastName(
            profile?.last_name ??
            user?.user_metadata?.last_name ??
            ''
        );

        setUsername(
            profile?.username ??
            user?.user_metadata?.username ??
            ''
        );

        setBio(profile?.bio ?? '');

        setAvatarUrl(
            profile?.avatar_url ??
            user?.user_metadata?.avatar_url ??
            null
        );
    }, [profile, user]);


    // Выбор фотографии
    const chooseAvatar = async () => {
        try {
            const permission =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted) {
                Alert.alert(
                    'Доступ к фото',
                    'Разрешите CASCAS доступ к галерее в настройках устройства.'
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.85,

                // Получаем фотографию в Base64
                base64: true,
            });

            if (result.canceled || !result.assets?.[0]) {
                return;
            }

            const asset = result.assets[0];

            if (!asset.base64) {
                Alert.alert(
                    'Ошибка',
                    'Не удалось подготовить фотографию. Попробуйте выбрать другое изображение.'
                );
                return;
            }

            setAvatarUri(asset.uri);
            setAvatarBase64(asset.base64);
            setAvatarMimeType(asset.mimeType || 'image/jpeg');
            setAvatarFileName(asset.fileName || null);

        } catch (error) {
            console.error('Ошибка выбора фотографии:', error);

            Alert.alert(
                'Ошибка',
                'Не удалось открыть галерею.'
            );
        }
    };


    // Сохранение профиля
    const handleSave = async () => {
        if (!firstName.trim() || !username.trim()) {
            Alert.alert(
                'Проверьте данные',
                'Имя и никнейм обязательны для заполнения.'
            );
            return;
        }

        if (!user?.id || saving) return;

        try {
            setSaving(true);

            await ProfileService.saveProfile({
                userId: user.id,

                firstName,
                lastName,
                username,
                bio,

                avatarBase64,
                avatarMimeType,
                avatarFileName,

                currentAvatarUrl: avatarUrl,
            });

            await refreshProfile();

            Alert.alert(
                'Готово',
                'Данные профиля успешно сохранены.'
            );

            navigation.goBack();

        } catch (error) {
            console.error('Ошибка сохранения профиля:', error);

            let message = error.message ||
                'Не удалось сохранить изменения.';

            if (error.message?.includes('user_profiles')) {
                message =
                    'Проверьте настройки таблицы user_profiles в Supabase.';
            } else if (
                error.message?.includes('avatars') ||
                error.message?.toLowerCase().includes('row-level security') ||
                error.statusCode === '403'
            ) {
                message =
                    'Нет разрешения на загрузку фотографии в Supabase Storage. Проверьте политики хранилища avatars.';
            }

            Alert.alert('Ошибка сохранения', message);

        } finally {
            setSaving(false);
        }
    };


    const displayedAvatar = avatarUri || avatarUrl;


    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >
            <ButtonBack onPress={() => navigation.goBack()} />

            <Text style={styles.heading}>
                Редактировать профиль
            </Text>

            <Pressable
                style={styles.avatarButton}
                onPress={chooseAvatar}
                disabled={saving}
            >
                {displayedAvatar ? (
                    <Image
                        source={{ uri: displayedAvatar }}
                        style={styles.avatarImage}
                    />
                ) : (
                    <Ionicons
                        name="person-outline"
                        size={42}
                        color={theme.primary}
                    />
                )}

                <View style={styles.cameraBadge}>
                    <Ionicons
                        name="camera"
                        size={16}
                        color="#FFFFFF"
                    />
                </View>
            </Pressable>

            <Text style={styles.avatarHint}>
                Нажмите, чтобы изменить фото
            </Text>

            <Text style={styles.label}>Имя</Text>

            <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Введите имя"
                placeholderTextColor={theme.textMuted}
                autoCapitalize="words"
                maxLength={40}
            />

            <Text style={styles.label}>Фамилия</Text>

            <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Введите фамилию"
                placeholderTextColor={theme.textMuted}
                autoCapitalize="words"
                maxLength={50}
            />

            <Text style={styles.label}>Никнейм</Text>

            <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="например, cassette_user"
                placeholderTextColor={theme.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={20}
            />

            <Text style={styles.hint}>
                3–20 символов: латинские буквы, цифры и знак _.
                Никнейм должен быть уникальным.
            </Text>

            <Text style={styles.label}>О себе</Text>

            <TextInput
                style={[styles.input, styles.bioInput]}
                value={bio}
                onChangeText={setBio}
                placeholder="Расскажите немного о себе"
                placeholderTextColor={theme.textMuted}
                multiline
                maxLength={250}
            />

            <Pressable
                style={({ pressed }) => [
                    styles.saveButton,
                    pressed && styles.pressed,
                    saving && styles.disabled,
                ]}
                onPress={handleSave}
                disabled={saving}
            >
                {saving ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text style={styles.saveText}>
                        Сохранить изменения
                    </Text>
                )}
            </Pressable>
        </ScrollView>
    );
}


function createStyles(theme) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },

        content: {
            padding: 20,
            paddingBottom: 45,
        },

        heading: {
            fontSize: 26,
            fontWeight: 'bold',
            color: theme.text,
            marginVertical: 20,
        },

        avatarButton: {
            width: 116,
            height: 116,
            borderRadius: 58,
            backgroundColor: theme.surface,
            borderWidth: 1,
            borderColor: theme.primary,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 8,
            overflow: 'hidden',
        },

        avatarImage: {
            width: 114,
            height: 114,
            borderRadius: 57,
        },

        cameraBadge: {
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: theme.primary,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: theme.background,
        },

        avatarHint: {
            textAlign: 'center',
            color: theme.textSecondary,
            fontSize: 13,
            marginTop: 10,
            marginBottom: 12,
        },

        label: {
            fontSize: 14,
            color: theme.text,
            fontWeight: '600',
            marginTop: 18,
            marginBottom: 8,
        },

        input: {
            minHeight: 50,
            borderWidth: 1,
            borderColor: theme.surfaceLight,
            borderRadius: 10,
            paddingHorizontal: 14,
            fontSize: 15,
            color: theme.text,
            backgroundColor: theme.surface,
        },

        bioInput: {
            height: 105,
            paddingTop: 13,
            textAlignVertical: 'top',
        },

        hint: {
            color: theme.textMuted,
            fontSize: 12,
            lineHeight: 17,
            marginTop: 7,
        },

        saveButton: {
            minHeight: 54,
            padding: 16,
            backgroundColor: theme.primary,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 30,
        },

        saveText: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#FFFFFF',
        },

        pressed: {
            opacity: 0.8,
        },

        disabled: {
            opacity: 0.6,
        },
    });
}
