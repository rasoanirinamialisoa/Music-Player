import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../src/navigationTypes';
import TrackPlayer, { useProgress, State, useTrackPlayerEvents, Event } from 'react-native-track-player';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider'; // Import mis à jour

type AudioPlayerPageRouteProp = RouteProp<RootStackParamList, 'AudioPlayerPage'>;

const AudioPlayerPage = ({ route }: { route: AudioPlayerPageRouteProp }) => {
  const { song, songs } = route.params;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const progress = useProgress();
  const [imageIndex, setImageIndex] = useState(0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const playPauseAudio = async () => {
    const { state } = await TrackPlayer.getPlaybackState();
    if (state === State.Playing) {
      await TrackPlayer.pause();
      setIsPlaying(false);
    } else {
      await TrackPlayer.play();
      setIsPlaying(true);
    }
  };

  const images = [
    require('../assets/girl1.png'),
    require('../assets/girl2.png'),
    require('../assets/girl3.png')
  ];

  useEffect(() => {
    setImageIndex(prevIndex => (prevIndex + 1) % images.length);
  }, [currentTrackIndex]);

  const nextTrack = async () => {
    let newIndex = currentTrackIndex + 1;
    if (isShuffling) {
      newIndex = Math.floor(Math.random() * songs.length);
    } else if (newIndex >= songs.length) {
      if (isLooping) {
        newIndex = currentTrackIndex;
      } else {
        newIndex = 0;
      }
    }

    if (newIndex !== currentTrackIndex) {
      await TrackPlayer.skip(newIndex);
      setCurrentTrackIndex(newIndex);
    }
  };

  const previousTrack = async () => {
    const newIndex = currentTrackIndex - 1;
    if (newIndex >= 0) {
      await TrackPlayer.skip(newIndex);
      setCurrentTrackIndex(newIndex);
    }
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  const toggleShuffle = () => {
    setIsShuffling(!isShuffling);
  };

  useEffect(() => {
    if (progress.position >= progress.duration && progress.duration > 0 && !isLooping) {
      nextTrack();
    }
  }, [progress.position, progress.duration, isLooping]);

  useTrackPlayerEvents([Event.PlaybackTrackChanged, Event.RemoteDuck, Event.PlaybackActiveTrackChanged], async (event) => {
    if (event.type === Event.RemoteDuck) {
      if (event.paused) {
        await TrackPlayer.pause();
        setIsPlaying(false);
      } else {
        await TrackPlayer.setVolume(0.5);
        setTimeout(() => TrackPlayer.setVolume(1), 3000);
      }
    }

    if (event.type === Event.PlaybackActiveTrackChanged) {
      const { state } = await TrackPlayer.getPlaybackState();
      if (state !== State.Playing) {
        await TrackPlayer.play();
        setIsPlaying(true);
      }
    }

    if (event.type === Event.PlaybackTrackChanged) {
      if (event.nextTrack !== null) {
        setCurrentTrackIndex(event.nextTrack);
      }
    }
  });

  useEffect(() => {
    const setupPlaylist = async () => {
      await TrackPlayer.reset();

      await TrackPlayer.add(
        songs.map((s, index) => ({
          id: String(index),
          url: s.path,
          title: s.title,
          artist: s.artist,
        }))
      );

      const songIndex = songs.findIndex((s) => s.title === song.title);
      if (songIndex !== -1) {
        await TrackPlayer.skip(songIndex);
        setCurrentTrackIndex(songIndex);
      } else {
        await TrackPlayer.skip(0);
        setCurrentTrackIndex(0);
      }

      setIsPlaying(false);
    };

    setupPlaylist();

    return () => {
      TrackPlayer.reset();
    };
  }, [songs, song]);

  return (
    <ImageBackground source={images[imageIndex]} style={styles.backgroundImage} blurRadius={10}>
      <View style={styles.container}>
        <Image source={images[imageIndex]} style={styles.musicIcon} />
        <Text style={styles.title}>{songs[currentTrackIndex].title}</Text>
        <Text style={styles.artist}>{songs[currentTrackIndex].artist}</Text>

        {/* Conteneur de la barre de progression */}
        <View style={styles.progressContainer}>
          {/* Progress bar slider */}
          <Slider
            style={styles.progressBar}
            minimumValue={0}
            maximumValue={progress.duration}
            value={progress.position}
            minimumTrackTintColor="#ffffff"
            maximumTrackTintColor="#ccc"
            thumbTintColor="#ffffff"
            onSlidingComplete={async (value) => {
              await TrackPlayer.seekTo(value);
            }}
          />
          <Text style={styles.time}>{formatTime(progress.position)} / {formatTime(progress.duration)}</Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity onPress={toggleShuffle}>
            <Icon name="shuffle" size={40} color={isShuffling ? "#d3d3d3" : "#aaa"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={previousTrack} disabled={currentTrackIndex === 0}>
            <Icon name="skip-previous" size={40} color={currentTrackIndex === 0 ? "#aaa" : "#d3d3d3"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={playPauseAudio}>
            <Icon name={isPlaying ? "pause" : "play-arrow"} size={40} color="#d3d3d3" />
          </TouchableOpacity>
          <TouchableOpacity onPress={nextTrack} disabled={currentTrackIndex === songs.length - 1}>
            <Icon name="skip-next" size={40} color={currentTrackIndex === songs.length - 1 ? "#aaa" : "#d3d3d3"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleLoop}>
            <Icon name={isLooping ? "repeat-one" : "repeat"} size={40} color={isLooping ? "#d3d3d3" : "#aaa"} />
          </TouchableOpacity>

        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(12, 12, 12, 0.5)', // Semi-transparent overlay for readability
    borderRadius: 10,
  },
  musicIcon: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  artist: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  progressContainer: {
    width: 300,
    zIndex: 1,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    height: 20,
  },
  time: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    width: '90%',
  },
});

export default AudioPlayerPage;
