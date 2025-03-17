import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../src/navigationTypes';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';

type AudioPlayerPageRouteProp = RouteProp<RootStackParamList, 'AudioPlayerPage'>;

const AudioPlayerPage = ({ route }: { route: AudioPlayerPageRouteProp }) => {
  const { song } = route.params;
  const [isPlaying, setIsPlaying] = useState(false);
  const progress = useProgress();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const playPauseAudio = async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = async () => {
    await TrackPlayer.skipToNext();
  };

  const previousTrack = async () => {
    await TrackPlayer.skipToPrevious();
  };

  useEffect(() => {
    TrackPlayer.add({
      id: song.id,
      url: song.path,
      title: song.title,
      artist: song.artist,
    });

    return () => {
      TrackPlayer.reset();
    };
  }, [song]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/moozik.png')} style={styles.musicIcon} />
      <Text style={styles.title}>{song.title}</Text>
      <Text style={styles.artist}>{song.artist}</Text>

      <Slider
        style={styles.progressBar}
        minimumValue={0}
        maximumValue={progress.duration}
        value={progress.position}
        minimumTrackTintColor="#6200ee"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#6200ee"
        onSlidingComplete={async (value) => {
          await TrackPlayer.seekTo(value);
        }}
      />
      <Text style={styles.time}>{formatTime(progress.position)} / {formatTime(progress.duration)}</Text>

      <View style={styles.controls}>
        <TouchableOpacity onPress={previousTrack}>
          <Icon name="skip-previous" size={40} color="#6200ee" />
        </TouchableOpacity>
        <TouchableOpacity onPress={playPauseAudio}>
          <Icon name={isPlaying ? "pause" : "play-arrow"} size={40} color="#6200ee" />
        </TouchableOpacity>
        <TouchableOpacity onPress={nextTrack}>
          <Icon name="skip-next" size={40} color="#6200ee" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  musicIcon: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  artist: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  progressBar: {
    width: '80%',
    height: 40,
    marginBottom: 10,
  },
  time: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    width: '60%',
  },
});

export default AudioPlayerPage;
