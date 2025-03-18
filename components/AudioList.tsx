import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { globalStyles } from '../styles/globalStyles';
import songs from '../src/data';
import { checkStoragePermission, requestStoragePermission } from '../utils/PermissionHandler';
import { listAudioFiles } from './AudioFileHandler';
import { setupPlayer } from './AudioPlayerHandler';
import AudioListItem from './AudioListItem';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../src/navigationTypes';
import { Song } from '../src/navigationTypes'; 

type AudioListNavigationProp = StackNavigationProp<RootStackParamList, 'AudioList'>;

type Props = {
  navigation: AudioListNavigationProp;
};

const AudioList = ({ navigation }: Props) => {
  const [audioFiles, setAudioFiles] = useState<Song[]>([]);

  const loadAudioFiles = async () => {
    const hasPermission = await checkStoragePermission();
    if (!hasPermission) {
      const permissionGranted = await requestStoragePermission();
      if (!permissionGranted) return;
    }

    const files = await listAudioFiles();
    const combinedData = [
      ...songs,
      ...files,
    ];
    setAudioFiles(combinedData);
  };

  useEffect(() => {
    setupPlayer();
    loadAudioFiles();

    return () => {
      TrackPlayer.reset();
    };
  }, []);

  return (
    <View style={globalStyles.container}>
      
      <FlatList
        data={audioFiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <AudioListItem
            item={item}
            onPress={() => navigation.navigate('AudioPlayerPage', { 
              song: item, 
              songs: audioFiles,
              songsList: audioFiles 
            })}
          />
        )}
      />
    </View>
  );
};

export default AudioList;
