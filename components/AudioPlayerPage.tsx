import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../src/navigationTypes';
import TrackPlayer, { useProgress, State, useTrackPlayerEvents, Event  } from 'react-native-track-player';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';



type AudioPlayerPageRouteProp = RouteProp<RootStackParamList, 'AudioPlayerPage'>;

const AudioPlayerPage = ({ route }: { route: AudioPlayerPageRouteProp }) => {
  const { song, songs } = route.params;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const progress = useProgress();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const playPauseAudio = async () => {
    const state = await TrackPlayer.getState();
    if (state === State.Playing) {
      await TrackPlayer.pause();
      setIsPlaying(false);
    } else {
      await TrackPlayer.play();
      setIsPlaying(true);
    }
  };

  const nextTrack = async () => {
    const newIndex = currentTrackIndex + 1;
    if (newIndex < songs.length) {
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

  useEffect(() => {
    if (progress.position >= progress.duration && progress.duration > 0) {
      nextTrack();
    }
  }, [progress.position, progress.duration]);
  
  
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    if (event.nextTrack !== null) {
      setCurrentTrackIndex(event.nextTrack); 
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
    <View style={styles.container}>
      <Image source={require('../assets/moozik.png')} style={styles.musicIcon} />
      <Text style={styles.title}>{songs[currentTrackIndex].title}</Text>
      <Text style={styles.artist}>{songs[currentTrackIndex].artist}</Text>

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
        <TouchableOpacity onPress={previousTrack} disabled={currentTrackIndex === 0}>
          <Icon name="skip-previous" size={40} color={currentTrackIndex === 0 ? "#aaa" : "#6200ee"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={playPauseAudio}>
          <Icon name={isPlaying ? "pause" : "play-arrow"} size={40} color="#6200ee" />
        </TouchableOpacity>
        <TouchableOpacity onPress={nextTrack} disabled={currentTrackIndex === songs.length - 1}>
          <Icon name="skip-next" size={40} color={currentTrackIndex === songs.length - 1 ? "#aaa" : "#6200ee"} />
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
