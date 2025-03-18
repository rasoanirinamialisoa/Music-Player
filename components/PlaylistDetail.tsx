import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../src/navigationTypes';
import { Song } from '../src/navigationTypes';

type PlaylistDetailRouteProp = RouteProp<RootStackParamList, 'PlaylistDetail'>;

type Props = {
  route: PlaylistDetailRouteProp;
};

const PlaylistDetail = ({ route }: Props) => {
  const { playlistId, playlistName, songs } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{playlistName}</Text>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Ajouter à la playlist</Text>
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