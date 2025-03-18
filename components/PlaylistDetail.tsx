import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles } from '../styles/globalStyles';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../src/navigationTypes';
import AudioListItem from './AudioListItem';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {
  route: RouteProp<RootStackParamList, 'PlaylistDetail'>;
  navigation: any;
};

const PlaylistDetails = ({ route, navigation }: Props) => {
  const { playlistName } = route.params;
  const [songs, setSongs] = useState<any[]>([]);

  useEffect(() => {
    loadPlaylist();
  }, []);

  const loadPlaylist = async () => {
    const playlistsJSON = await AsyncStorage.getItem('playlists');
    const playlists = playlistsJSON ? JSON.parse(playlistsJSON) : {};
    setSongs(playlists[playlistName] || []);
  };

  const handleAddSongs = () => {
    navigation.navigate('SongSelector', { playlistName });
  };

  const handleSongClick = (song: any) => {
    navigation.navigate('SongPlayer', { song });
  };

  const handleDeleteSong = async (songId: string) => {
    const playlistsJSON = await AsyncStorage.getItem('playlists');
    const playlists = playlistsJSON ? JSON.parse(playlistsJSON) : {};

    const updatedSongs = songs.filter((song) => song.id !== songId);

    playlists[playlistName] = updatedSongs;
    await AsyncStorage.setItem('playlists', JSON.stringify(playlists));

    setSongs(updatedSongs);
  };

  return (
    <View style={globalStyles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon name="favorite" size={24} color="pink" style={{ marginRight: 10 }} />
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>
          {playlistName}
        </Text>
      </View>

      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 5,
              borderBottomWidth: 1,
              borderBottomColor: '#444',
            }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() =>
                navigation.navigate('AudioPlayerPage', {
                  song: item,
                  songs: songs,
                  songsList: songs,
                })
              }
            >
              <AudioListItem
                item={item}
                onPress={() =>
                  navigation.navigate('AudioPlayerPage', {
                    song: item,
                    songs: songs,
                    songsList: songs,
                  })
                }
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleDeleteSong(item.id)}>
              <Icon name="delete" size={24} color="gray" style={{ padding: 5 }} />
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        style={{
          backgroundColor: 'purple',
          padding: 10,
          borderRadius: 5,
          marginTop: 20,
          alignItems: 'center',
        }}
        onPress={handleAddSongs}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          + Ajouter des chansons
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PlaylistDetails;
