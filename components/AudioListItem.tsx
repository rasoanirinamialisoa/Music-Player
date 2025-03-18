import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

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
  const [isPressed, setIsPressed] = useState(false); 

  const handlePress = () => {
    setIsPressed(true); 
    onPress(item.path);
    setTimeout(() => setIsPressed(false), 200);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7} 
      style={styles.touchable}
    >
      <View style={styles.item}>
        <Image
          source={require('../assets/music_icon.png')}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <Text style={[styles.name, isPressed && styles.pressedText]}>{item.title}</Text>
          <Text style={[styles.artist, isPressed && styles.pressedText]}>{item.artist}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    backgroundColor: '#fff', 
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc', 
    backgroundColor: 'rgb(25, 2, 39)', 
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
    color: 'rgb(255, 255, 255)', 
    fontSize: 16,
  },
  artist: {
    color: '#666', 
    fontSize: 12,
  },
  pressedText: {
    color: '#6200ee',
  },
});

export default AudioListItem;