import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { globalStyles } from '../styles/globalStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../src/navigationTypes';
import { Song } from '../src/navigationTypes';
import AudioListItem from './AudioListItem';
import SongSelector from './SongSelector';
import { setupPlayer } from '../services/trackPlayerService';

type AudioListNavigationProp = StackNavigationProp<RootStackParamList, 'AudioList'>;

type Props = {
  navigation: AudioListNavigationProp;
};

const AudioList = ({ navigation }: Props) => {
  const [audioFiles, setAudioFiles] = useState<Song[]>([]);
  const [isSelectorVisible, setSelectorVisible] = useState(false);

  useEffect(() => {
    setupPlayer();
    return () => {
      TrackPlayer.reset();
    };
  }, []);

  return (
    <View style={globalStyles.container}>
      {isSelectorVisible ? (
        <SongSelector
          onConfirmSelection={(selectedSongs) => {
            setAudioFiles(selectedSongs);
            setSelectorVisible(false);
          }}
          onCancel={() => setSelectorVisible(false)}
        />
      ) : (
        <>
          <FlatList
            data={audioFiles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <AudioListItem
                item={item}
                onPress={() =>
                  navigation.navigate('AudioPlayerPage', {
                    song: item,
                    songs: audioFiles,
                    songsList: audioFiles,
                  })
                }
              />
            )}
          />
        </>
      )}
    </View>
  );
};

export default AudioList;
