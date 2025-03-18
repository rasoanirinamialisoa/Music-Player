import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Song } from '../src/navigationTypes';

type PlaylistDetailRouteProp = RouteProp<RootStackParamList, 'PlaylistDetail'>;
type NavigationProp = StackNavigationProp<RootStackParamList, 'PlaylistDetail'>;

type Props = {
  route: PlaylistDetailRouteProp;
};

const PlaylistDetail = ({ route }: Props) => {
  const navigation = useNavigation<NavigationProp>();
  const { playlistId, playlistName } = route.params;
  const [songs, setSongs] = useState<Song[]>(route.params.songs || []);
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);

  useEffect(() => {
    if (route.params?.selectedSongs) {
      setSongs([...songs, ...route.params.selectedSongs]);
    }
  }, [route.params?.selectedSongs]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{playlistName}</Text>
      
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => navigation.navigate('AudioList', { fromPlaylist: true })}
      >
        <Text style={styles.addButtonText}>+ Ajouter des chansons</Text>
      </TouchableOpacity>

      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.songItem}>
            <Text style={styles.songTitle}>{item.title}</Text>
            <Text style={styles.songArtist}>{item.artist}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#1db954',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  songItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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

export default PlaylistDetail;
