import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles } from '../styles/globalStyles';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../src/navigationTypes';
import AudioListItem from './AudioListItem';

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

  return (
    <View style={globalStyles.container}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{playlistName}</Text>
      <FlatList
            data={songs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
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
        <Text style={{ color: 'white', fontWeight: 'bold' }}>+ Ajouter des chansons</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PlaylistDetails;
