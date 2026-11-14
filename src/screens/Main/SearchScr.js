import React, { useState } from 'react';

import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    Pressable,
    ActivityIndicator,
    Keyboard,
} from 'react-native';

import ButtonBack from '../../components/Button/3/ButtonBack';
import ButtonDelete from '../../components/Button/2/ButtonDelete';

import { getPodcasts } from '../../Podcast/Services/PodcastService';
import { useTheme } from '../../theme';

export default function SearchScr({ navigation }) {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const [searchText, setSearchText] = useState('');
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Поиск запускается только после нажатия Enter на клавиатуре.
    const handleSearch = async () => {
        const value = searchText.trim();

        if (!value) {
            setQuery('');
            setResults([]);
            setHasSearched(false);
            setError('');
            return;
        }

        Keyboard.dismiss();
        setQuery(value);
        setHasSearched(true);
        setLoading(true);
        setError('');

        try {
            // Получаем реальные опубликованные подкасты из Supabase.
            const podcasts = await getPodcasts();
            const normalizedQuery = value.toLocaleLowerCase();

            const filtered = (podcasts || []).filter((podcast) => {
                const title = (podcast.title || '').toLocaleLowerCase();
                const author = (podcast.author || '').toLocaleLowerCase();
                const description = (podcast.description || '').toLocaleLowerCase();

                return (
                    title.includes(normalizedQuery) ||
                    author.includes(normalizedQuery) ||
                    description.includes(normalizedQuery)
                );
            });

            setResults(filtered);
        } catch (err) {
            console.error('Ошибка поиска подкастов:', err);
            setResults([]);
            setError('Не удалось выполнить поиск. Проверьте подключение и настройки Supabase.');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setSearchText('');
        setQuery('');
        setResults([]);
        setHasSearched(false);
        setError('');
    };

    return (
        <View style={styles.container}>
            <ButtonBack onPress={() => navigation.goBack()} />

            <Text style={styles.heading}>Поиск</Text>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Название подкаста"
                    placeholderTextColor={theme.textMuted}
                    value={searchText}
                    onChangeText={setSearchText}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                    enterKeyHint="search"
                    autoCorrect={false}
                    autoCapitalize="none"
                    accessibilityLabel="Поиск подкастов"
                />

                {!!searchText && <ButtonDelete onPress={handleClear} />}
            </View>

            <Text style={styles.subtitle}>Результаты поиска</Text>

            <ScrollView
                style={styles.resultsList}
                contentContainerStyle={styles.resultsContent}
                keyboardShouldPersistTaps="handled"
            >
                {loading ? (
                    <View style={styles.statusContainer}>
                        <ActivityIndicator size="large" color={theme.primary} />
                        <Text style={styles.empty}>Ищем подкасты...</Text>
                    </View>
                ) : error ? (
                    <Text style={styles.empty}>{error}</Text>
                ) : !hasSearched ? (
                    <Text style={styles.empty}>Введите название подкаста и нажмите Enter.</Text>
                ) : results.length === 0 ? (
                    <Text style={styles.empty}>По запросу «{query}» ничего не найдено.</Text>
                ) : (
                    results.map((item) => (
                        <Pressable
                            key={item.id}
                            style={styles.result}
                            onPress={() => navigation.navigate('Podcast', {
                                podcastId: item.id,
                                podcastName: item.title,
                            })}
                        >
                            <Text style={styles.resultTitle}>{item.title}</Text>
                            <Text style={styles.author}>{item.author || 'Автор не указан'}</Text>
                            {!!item.description && (
                                <Text style={styles.description} numberOfLines={2}>
                                    {item.description}
                                </Text>
                            )}
                        </Pressable>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

function createStyles(theme) {
    return StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: theme.background,
        },
        heading: {
            fontSize: 28,
            fontWeight: 'bold',
            color: theme.text,
            marginVertical: 20,
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginBottom: 15,
        },
        input: {
            flex: 1,
            minWidth: 0,
            height: 54,
            borderWidth: 1,
            borderColor: theme.surfaceLight,
            borderRadius: 12,
            paddingHorizontal: 16,
            color: theme.text,
            backgroundColor: theme.surface,
            fontSize: 16,
        },
        subtitle: {
            fontSize: 20,
            fontWeight: 'bold',
            marginTop: 25,
            marginBottom: 15,
            color: theme.text,
        },
        resultsList: {
            flex: 1,
        },
        resultsContent: {
            paddingBottom: 24,
        },
        result: {
            padding: 16,
            borderWidth: 1,
            borderColor: theme.surfaceLight,
            borderRadius: 12,
            marginBottom: 12,
            backgroundColor: theme.surface,
        },
        resultTitle: {
            fontSize: 17,
            fontWeight: 'bold',
            color: theme.text,
        },
        author: {
            fontSize: 14,
            color: theme.textSecondary,
            marginTop: 6,
        },
        description: {
            fontSize: 14,
            lineHeight: 20,
            color: theme.textSecondary,
            marginTop: 8,
        },
        statusContainer: {
            alignItems: 'center',
            marginTop: 30,
        },
        empty: {
            textAlign: 'center',
            color: theme.textMuted,
            marginTop: 30,
            lineHeight: 22,
        },
    });
}
