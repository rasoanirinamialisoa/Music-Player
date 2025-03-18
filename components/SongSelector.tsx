import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { checkStoragePermission, requestStoragePermission } from '../utils/PermissionHandler';
import { listAudioFiles } from './AudioFileHandler';
import { Song } from '../src/navigationTypes';

type Props = {
  onConfirmSelection: (selectedSongs: Song[]) => void;
  onCancel: () => void;
};

const SongSelector = ({ onConfirmSelection, onCancel }: Props) => {
  const [audioFiles, setAudioFiles] = useState<Song[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);

  useEffect(() => {
    const loadAudioFiles = async () => {
      const hasPermission = await checkStoragePermission();
      if (!hasPermission) {
        const permissionGranted = await requestStoragePermission();
        if (!permissionGranted) return;
      }

      const files = await listAudioFiles();
      setAudioFiles(files);
    };

    loadAudioFiles();
  }, []);

  const toggleSelection = (song: Song) => {
    setSelectedSongs((prev) => {
      if (prev.some((s) => s.id === song.id)) {
        return prev.filter((s) => s.id !== song.id);
      } else {
        return [...prev, song];
      }
    });
  };

  return (
    <View style={globalStyles.container}>
      <FlatList
        data={audioFiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 10,
              backgroundColor: selectedSongs.some((s) => s.id === item.id) ? 'lightblue' : 'white',
            }}
            onPress={() => toggleSelection(item)}
          >
            <Text>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
        <TouchableOpacity onPress={onCancel}>
          <Text style={{ color: 'red' }}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onConfirmSelection(selectedSongs)}>
          <Text style={{ color: 'green' }}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SongSelector;
