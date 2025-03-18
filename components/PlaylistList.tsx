import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../src/navigationTypes';
import { Song } from '../src/navigationTypes';

type PlaylistListNavigationProp = StackNavigationProp<RootStackParamList, 'PlaylistList'>;

type Props = {
  navigation: PlaylistListNavigationProp;
};

const PlaylistList = ({ navigation }: Props) => {
  const [playlists, setPlaylists] = useState<{ id: string; name: string; songs: Song[] }[]>([
    { id: '1', name: 'Lecture aléatoire', songs: [] },
    { id: '2', name: 'Kambana Metaly - Ianao no Tïako', songs: [] },
  ]);

  return (
    <View style={styles.container}>
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.playlistItem}
            onPress={() => navigation.navigate('PlaylistDetail', { playlistId: item.id, playlistName: item.name, songs: item.songs })}
          >
            <Text style={styles.playlistText}>{item.name}</Text>
          </TouchableOpacity>
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
  playlistItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  playlistText: {
    fontSize: 16,
  },
});

export default PlaylistList;