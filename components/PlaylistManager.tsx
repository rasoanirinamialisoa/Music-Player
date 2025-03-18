import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles } from '../styles/globalStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../src/navigationTypes';

type NavigationProp = StackNavigationProp<RootStackParamList, 'PlaylistManager'>;

type Props = {
  navigation: NavigationProp;
};

const PlaylistManager = ({ navigation }: Props) => {
  const [playlists, setPlaylists] = useState<{ [key: string]: any[] }>({});

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      const playlistsJSON = await AsyncStorage.getItem('playlists');
      if (playlistsJSON) {
        setPlaylists(JSON.parse(playlistsJSON));
      }
    } catch (error) {
      console.error('Erreur de chargement des playlists', error);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Mes Playlists</Text>
      <FlatList
        data={Object.keys(playlists)}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={{ padding: 10, backgroundColor: 'lightgray', marginBottom: 5 }}
            onPress={() => navigation.navigate('PlaylistDetails', { playlistName: item })}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity 
        style={{ padding: 10, backgroundColor: 'green', marginTop: 20 }}
        onPress={() => navigation.navigate('SongSelector')}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Créer une nouvelle playlist</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PlaylistManager;
