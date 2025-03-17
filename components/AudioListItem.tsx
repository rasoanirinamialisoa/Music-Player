
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../styles/globalStyles'; 

type Song = {
  id: string;
  title: string;
  artist: string;
  path: string;
};

type AudioListItemProps = {
  item: Song;
  onPress: (path: string) => void;
};

const AudioListItem = ({ item, onPress }: AudioListItemProps) => {
  return (
    <TouchableOpacity onPress={() => onPress(item.path)}>
      <View style={styles.item}>
        <Image
          source={require('../assets/music_icon.png')}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.title}</Text>
          <Text style={styles.artist}>{item.artist}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary, 
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    color: colors.text, 
    fontSize: 16,
  },
  artist: {
    color: colors.accent, 
    fontSize: 12,
  },
});

export default AudioListItem;