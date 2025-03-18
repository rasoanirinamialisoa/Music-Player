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
        <TouchableOpacity
          style={[styles.button, styles.purpleButton]}
          onPress={() => navigation.navigate('AudioList')}
        >
          <Text style={styles.buttonText}>Liste des chansons</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.greenButton]}
          onPress={() => navigation.navigate('PlaylistList')}
        >
          <Text style={styles.buttonText}>Listes de lecture</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.randomSection}>
        <Text style={styles.randomTitle}>Lecture aléatoire</Text>
        <TouchableOpacity onPress={playRandomSong} style={styles.playButton}>
          <Icon name="play-arrow" size={30} color="#fff" />
        </TouchableOpacity>
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
    backgroundColor: '#f0f0f0',
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
  purpleButton: {
    backgroundColor: '#6200ee',
  },
  greenButton: {
    backgroundColor: '#1db954',
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
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3, // Ombre pour Android
    shadowColor: '#000', // Ombre pour iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  randomTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  playButton: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 50,
  },
  songItem: {
    flexDirection: 'row', // Pour aligner l'icône et le texte horizontalement
    alignItems: 'center', // Centrer verticalement
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  icon: {
    width: 40, // Taille de l'icône
    height: 40,
    marginRight: 12, // Espace entre l'icône et le texte
  },
  textContainer: {
    flex: 1, // Pour occuper tout l'espace disponible
  },
  songTitle: {
    fontSize: 16,
    color: '#333',
  },
  songArtist: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen;