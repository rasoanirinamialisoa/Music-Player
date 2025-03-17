import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import AudioPlayer from '../components/AudioPlayer/AudioPlayer';
import Playlist from '../components/PlayList/PlayList';
import AudioList from '../components/AudioList';
import Metadata from '../components/Metadata/Metadata';

const HomeScreen = () => {
  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.title}>Lecteur de Musique</Text>
      <AudioList/>
      <Metadata />
      <AudioPlayer />
      <Playlist />
    </ScrollView>
  );
};

export default HomeScreen;