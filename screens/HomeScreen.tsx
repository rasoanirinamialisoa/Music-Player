import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../src/navigationTypes';
import { checkStoragePermission, requestStoragePermission } from '../utils/PermissionHandler';
import { listAudioFiles } from '../components/AudioFileHandler';
import { setupPlayer, playAudio } from '../components/AudioPlayerHandler';
import { Song } from '../src/navigationTypes';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TrackPlayer from 'react-native-track-player';
import LinearGradient from 'react-native-linear-gradient'; 

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen = ({ navigation }: Props) => {
  const [audioFiles, setAudioFiles] = useState<Song[]>([]);

  const loadAudioFiles = async () => {
    const hasPermission = await checkStoragePermission();
    if (!hasPermission) {
      const permissionGranted = await requestStoragePermission();
      if (!permissionGranted) return;
    }

    const files = await listAudioFiles();
    setAudioFiles(files);
  };

  const playRandomSong = () => {
    if (audioFiles.length > 0) {
      const randomIndex = Math.floor(Math.random() * audioFiles.length);
      const randomSong = audioFiles[randomIndex];
      playAudio(randomSong.path);
      navigation.navigate('AudioPlayerPage', {
        song: randomSong,
        songs: audioFiles,
        songsList: audioFiles,
      });
    }
  };

  useEffect(() => {
    setupPlayer();
    loadAudioFiles();

    return () => {
      TrackPlayer.reset();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <LinearGradient
          colors={['#FF69B4','#9B59B6']}
          style={[styles.button, styles.gradientButton]}
        >
          <TouchableOpacity onPress={() => navigation.navigate('AudioList')}>
            <Text style={styles.buttonText}>Liste des chansons</Text>
          </TouchableOpacity>
        </LinearGradient>

        <LinearGradient
          colors={['#9B59B6', '#FF69B4']} 
          style={[styles.button, styles.gradientButton]}
        >
          <TouchableOpacity onPress={() => navigation.navigate('PlaylistList')}>
            <Text style={styles.buttonText}>Listes de lecture</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <View style={styles.randomSection}>
  <Text style={styles.randomTitle}>Lecture aléatoire</Text>
  <LinearGradient
    colors={['#FF69B4', '#9B59B6']} 
    style={styles.gradientPlayButton} 
  >
    <TouchableOpacity onPress={playRandomSong} style={styles.playButton}>
      <Icon name="play-arrow" size={30} color="#fff" />
    </TouchableOpacity>
  </LinearGradient>
</View>

      <FlatList
        data={audioFiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.songItem}
            onPress={() => navigation.navigate('AudioPlayerPage', { 
              song: item, 
              songs: audioFiles, 
              songsList: audioFiles 
            })}
          >
            <Image
              source={require('../assets/music_icon.png')}
              style={styles.icon}
            />
            <View style={styles.textContainer}>
              <Text style={styles.songTitle}>{item.title}</Text>
              <Text style={styles.songArtist}>{item.artist}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(25, 2, 39)',
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    width: '48%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  gradientButton: {
    borderRadius: 10,
    padding: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  randomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'rgb(47, 46, 48)',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  randomTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(255, 255, 255)',
  },
  playButton: {
    padding: 8,
    borderRadius: 50,
  },
  gradientPlayButton: {
    borderRadius: 50,
    padding: 5,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    color: '#aaa',
  },
  songArtist: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen;
