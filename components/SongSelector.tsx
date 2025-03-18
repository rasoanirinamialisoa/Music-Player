import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles } from '../styles/globalStyles';
import { checkStoragePermission, requestStoragePermission } from '../utils/PermissionHandler';
import { listAudioFiles } from './AudioFileHandler';
import { Song } from '../src/navigationTypes';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import d'icônes

type Props = {
  navigation: any;
  route: { params: { playlistName: string } };
};

const SongSelector = ({ navigation, route }: Props) => {
  const { playlistName } = route.params;
  const [audioFiles, setAudioFiles] = useState<Song[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);

  useEffect(() => {
    loadAudioFiles();
  }, []);

  const loadAudioFiles = async () => {
    const hasPermission = await checkStoragePermission();
    if (!hasPermission) {
      const permissionGranted = await requestStoragePermission();
      if (!permissionGranted) return;
    }
    const files = await listAudioFiles();
    setAudioFiles(files);
  };

  const toggleSelection = (song: Song) => {
    setSelectedSongs((prev) =>
      prev.some((s) => s.id === song.id) ? prev.filter((s) => s.id !== song.id) : [...prev, song]
    );
  };

  const saveToPlaylist = async () => {
    if (selectedSongs.length === 0) {
      Alert.alert('Erreur', 'Veuillez sélectionner au moins une chanson.');
      return;
    }

    try {
      const playlistsJSON = await AsyncStorage.getItem('playlists');
      const playlists = playlistsJSON ? JSON.parse(playlistsJSON) : {};

      // Ajoute les nouvelles chansons sans supprimer les anciennes
      playlists[playlistName] = [...(playlists[playlistName] || []), ...selectedSongs];

      await AsyncStorage.setItem('playlists', JSON.stringify(playlists));
      Alert.alert('Succès', `Chansons ajoutées à "${playlistName}" !`);
      
      // Naviguer vers les détails de la playlist
      navigation.navigate('PlaylistDetail', { playlistName });
    } catch (error) {
      console.error('Erreur de sauvegarde', error);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>
        Ajouter des chansons à {playlistName}
      </Text>
      
      <FlatList
        data={audioFiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              padding: 10,
              backgroundColor: selectedSongs.some((s) => s.id === item.id) ? 'lightblue' : 'white',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderBottomColor: '#ddd',
            }}
            onPress={() => toggleSelection(item)}
          >
            <Icon name="music-note" size={24} color="gray" style={{ marginRight: 10 }} />
            <Text style={{ flex: 1 }}>{item.title}</Text>
            <TouchableOpacity
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: 'pink',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => toggleSelection(item)}
            >
              <Icon name="add" size={20} color="white" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      {/* Boutons OK et Annuler */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#d3d3d3', // Gris clair
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 20,
            marginRight: 10,
            alignItems: 'center',
           
          }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: 'black', fontWeight: 'bold' }}>Annuler</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={{
            backgroundColor: '#d3d3d3',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 20,
            alignItems: 'center',
            padding: 10,
           
          }}
          onPress={saveToPlaylist}
        >
          <Text style={{ color: 'black', fontWeight: 'bold' }}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SongSelector;
