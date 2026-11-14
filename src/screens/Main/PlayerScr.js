
import React, { useState, useEffect, useRef, useCallback } from 'react';

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
} from 'react-native';

import {
    useAudioPlayer,
    useAudioPlayerStatus,
    setAudioModeAsync,
} from 'expo-audio';

import { useTheme } from '../../theme';
import { useQueue } from '../../Podcast/Context/QueueContext';

import ButtonBack from '../../components/Button/3/ButtonBack';
import ButtonPlay from '../../components/Button/3/ButtonPlay';
import ButtonPause from '../../components/Button/3/ButtonPause';
import ButtonNext from '../../components/Button/3/ButtonNext';
import ButtonPreviouse from '../../components/Button/3/ButtonPreviouse';
import ButtonForward from '../../components/Button/3/ButtonForward';
import ButtonRewind from '../../components/Button/3/ButtonRewind';
import ButtonFavorite from '../../components/Button/4/ButtonFavorite';
import ButtonQueue from '../../components/Button/4/ButtonQueue';

import BarProgress from '../../components/StatusBar/BarProgress';
import BarVolumeSlider from '../../components/StatusBar/BarVolumeSlider';
import BarPlaybackSpeed from '../../components/StatusBar/BarPlaybackSpeed';

import { saveListeningHistory } from '../../Podcast/Services/PodcastService';

import {
    addFavorite,
    removeFavorite,
    isEpisodeFavorite,
} from '../../Podcast/Services/FavoritesService';


export default function PlayerScr({ navigation, route }) {

    const { theme } = useTheme();

    const [currentEpisodeId, setCurrentEpisodeId] = useState(route.params?.episodeId || null);
    const [episodeTitle, setEpisodeTitle] = useState(route.params?.episodeTitle || 'Название выпуска');
    const [podcastName, setPodcastName] = useState(route.params?.podcastName || 'Название подкаста');
    const [audioUrl, setAudioUrl] = useState(route.params?.audioUrl || null);
    const [coverUrl, setCoverUrl] = useState(route.params?.coverUrl || null);
    const { takeNext } = useQueue();

    const player = useAudioPlayer(null);
    const status = useAudioPlayerStatus(player);

    const [volume, setVolume] = useState(1);
    const [speed, setSpeed] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    const isPlaying = status.playing || false;
    const currentTime = status.currentTime || 0;
    const duration = status.duration || 0;

    const lastSavedTime = useRef(-1);
    const hasStarted = useRef(false);
    const changingTrack = useRef(false);
    const lastRouteEpisodeId = useRef(route.params?.episodeId || null);

    // Обновляем текущий выпуск, если экран Player уже открыт в стеке навигации.
    useEffect(() => {
        const nextId = route.params?.episodeId;
        if (!nextId || String(nextId) === String(lastRouteEpisodeId.current)) return;

        lastRouteEpisodeId.current = nextId;
        setCurrentEpisodeId(nextId);
        setEpisodeTitle(route.params?.episodeTitle || 'Название выпуска');
        setPodcastName(route.params?.podcastName || 'Название подкаста');
        setAudioUrl(route.params?.audioUrl || null);
        setCoverUrl(route.params?.coverUrl || null);
        hasStarted.current = false;
        lastSavedTime.current = -1;
        if (route.params?.audioUrl) player.replace(route.params.audioUrl);
    }, [route.params?.episodeId, route.params?.audioUrl, player]);


    // Загружаем первоначальный аудиофайл в единый экземпляр плеера.
    useEffect(() => {
        if (route.params?.audioUrl) player.replace(route.params.audioUrl);
    }, [player]);


    // Загрузка состояния избранного

    useEffect(() => {

        let isActive = true;

        async function loadFavoriteStatus() {

            if (!currentEpisodeId) {
                setIsFavorite(false);
                return;
            }

            try {

                const favorite = await isEpisodeFavorite(currentEpisodeId);

                if (isActive) {
                    setIsFavorite(favorite);
                }

            } catch (error) {

                console.error(
                    'Ошибка проверки избранного:',
                    error
                );

            }

        }

        loadFavoriteStatus();

        return () => {
            isActive = false;
        };

    }, [currentEpisodeId]);


    // Настройка аудио

    useEffect(() => {

        async function configureAudio() {

            try {

                await setAudioModeAsync({
                    playsInSilentMode: true,
                    interruptionMode: 'doNotMix',
                });

            } catch (error) {

                console.log(
                    'Ошибка настройки аудио:',
                    error
                );

            }

        }

        configureAudio();

    }, []);


    // Громкость

    useEffect(() => {

        player.volume = volume;

    }, [volume, player]);


    // Скорость воспроизведения

    useEffect(() => {

        player.setPlaybackRate(speed);

    }, [speed, player]);


    // Воспроизведение и пауза

    const handlePlayPause = async () => {

        if (!audioUrl) {
            console.log('Ссылка на аудиофайл не передана');
            return;
        }

        if (isPlaying) {
            player.pause();
            return;
        }

        if (currentEpisodeId && !hasStarted.current) {

            try {

                await saveListeningHistory(
                    currentEpisodeId,
                    currentTime
                );

                hasStarted.current = true;
                lastSavedTime.current = currentTime;

            } catch (error) {

                console.error(
                    'Не удалось сохранить историю:',
                    error
                );

            }

        }

        player.play();

    };


    // Сохранение прогресса каждые 15 секунд

    useEffect(() => {

        if (!isPlaying || !currentEpisodeId) return;

        if (currentTime - lastSavedTime.current < 15) {
            return;
        }

        lastSavedTime.current = currentTime;

        saveListeningHistory(currentEpisodeId, currentTime)
            .catch(error => {
                console.error(
                    'Ошибка обновления прогресса:',
                    error
                );
            });

    }, [currentTime, isPlaying, currentEpisodeId]);


    // Запуск следующего выпуска из очереди (вручную или автоматически).
    const handleNextEpisode = useCallback((showMessage = false) => {
        const nextEpisode = takeNext(currentEpisodeId);
        if (!nextEpisode) {
            if (showMessage) Alert.alert('Очередь', 'Следующих выпусков в очереди нет.');
            return false;
        }

        changingTrack.current = true;
        setCurrentEpisodeId(nextEpisode.id);
        setEpisodeTitle(nextEpisode.title || 'Название выпуска');
        setPodcastName(nextEpisode.podcast || 'Подкаст');
        setAudioUrl(nextEpisode.audio_url);
        setCoverUrl(nextEpisode.cover_url || null);
        setIsFavorite(false);
        hasStarted.current = false;
        lastSavedTime.current = -1;
        player.replace(nextEpisode.audio_url);
        player.play();
        return true;
    }, [takeNext, currentEpisodeId, player]);


    // Автоматический переход к следующему выпуску из очереди
    useEffect(() => {
        if (!status.didJustFinish) {
            changingTrack.current = false;
            return;
        }

        if (changingTrack.current) return;
        changingTrack.current = true;

        const started = handleNextEpisode();
        if (!started) changingTrack.current = false;
    }, [status.didJustFinish, handleNextEpisode]);


    // Перемотка вперёд

    const handleForward = () => {

        if (!duration) return;

        player.seekTo(
            Math.min(currentTime + 15, duration)
        );

    };


    // Перемотка назад

    const handleRewind = () => {

        player.seekTo(
            Math.max(currentTime - 15, 0)
        );

    };


    // Изменение позиции воспроизведения

    const handleSeek = (time) => {

        player.seekTo(time);

    };


    // Избранное

    const handleFavorite = async () => {

        if (!currentEpisodeId || favoriteLoading) return;

        try {

            setFavoriteLoading(true);

            if (isFavorite) {

                await removeFavorite(currentEpisodeId);
                setIsFavorite(false);

            } else {

                await addFavorite(currentEpisodeId);
                setIsFavorite(true);

            }

        } catch (error) {

            console.error(
                'Ошибка изменения избранного:',
                error
            );

            Alert.alert(
                'Избранное',
                error.message ||
                'Не удалось изменить избранное. Попробуйте ещё раз.'
            );

        } finally {

            setFavoriteLoading(false);

        }

    };


    return (

        <ScrollView
            style={[
                styles.container,
                { backgroundColor: theme.background },
            ]}
            contentContainerStyle={styles.content}
        >

            <ButtonBack
                onPress={() => navigation.goBack()}
            />


            <View style={styles.player}>

                {/* Обложка */}

                <View
                    style={[
                        styles.cover,
                        {
                            backgroundColor: theme.surfaceLight,
                        },
                    ]}
                >

                    {coverUrl ? (

                        <Image
                            source={{ uri: coverUrl }}
                            style={styles.coverImage}
                            resizeMode="cover"
                        />

                    ) : (

                        <Text
                            style={[
                                styles.coverText,
                                { color: theme.textSecondary },
                            ]}
                        >
                            Обложка выпуска
                        </Text>

                    )}

                </View>


                {/* Название выпуска */}

                <Text
                    style={[
                        styles.title,
                        { color: theme.text },
                    ]}
                >
                    {episodeTitle}
                </Text>


                {/* Название подкаста */}

                <Text
                    style={[
                        styles.podcast,
                        { color: theme.textSecondary },
                    ]}
                >
                    {podcastName}
                </Text>


                {!audioUrl && (

                    <Text
                        style={[
                            styles.error,
                            { color: theme.error },
                        ]}
                    >
                        Аудиофайл не передан.
                    </Text>

                )}


                {/* Прогресс */}

                <View style={styles.progress}>

                    <BarProgress
                        currentTime={currentTime}
                        duration={duration}
                        onSeek={handleSeek}
                    />

                </View>


                {/* Управление воспроизведением */}

                <View style={styles.controls}>

                    <ButtonPreviouse
                        onPress={() => player.seekTo(0)}
                    />

                    <ButtonRewind
                        onPress={handleRewind}
                    />

                    {isPlaying ? (

                        <ButtonPause
                            onPress={handlePlayPause}
                        />

                    ) : (

                        <ButtonPlay
                            onPress={handlePlayPause}
                        />

                    )}

                    <ButtonForward
                        onPress={handleForward}
                    />

                    <ButtonNext
                        onPress={() => handleNextEpisode(true)}
                    />

                </View>


                {/* Дополнительные кнопки */}

                <View style={styles.additional}>

                    <ButtonFavorite
                        isFavorite={isFavorite}
                        onPress={handleFavorite}
                        disabled={favoriteLoading}
                    />

                    <ButtonQueue
                        onPress={() => navigation.navigate('Queue')}
                    />

                </View>


                {/* Настройки */}

                <View style={styles.settings}>

                    <BarVolumeSlider
                        volume={volume}
                        onVolumeChange={setVolume}
                    />

                    <BarPlaybackSpeed
                        speed={speed}
                        onSpeedChange={setSpeed}
                    />

                </View>

            </View>

        </ScrollView>

    );

}


const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    content: {
        padding: 20,
        paddingBottom: 40,
    },

    player: {
        alignItems: 'center',
        paddingBottom: 40,
    },

    cover: {
        width: 250,
        height: 250,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 30,
        overflow: 'hidden',
    },

    coverImage: {
        width: '100%',
        height: '100%',
    },

    coverText: {
        fontSize: 14,
    },

    title: {
        fontSize: 23,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    podcast: {
        fontSize: 15,
        marginTop: 10,
    },

    error: {
        fontSize: 13,
        textAlign: 'center',
        marginTop: 15,
    },

    progress: {
        width: '100%',
        marginTop: 30,
    },

    controls: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginTop: 25,
    },

    additional: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 15,
        marginTop: 30,
    },

    settings: {
        width: '100%',
        marginTop: 35,
        gap: 25,
    },

});
