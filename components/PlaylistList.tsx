import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../src/navigationTypes';
import { Song } from '../src/navigationTypes';
import Icon from 'react-native-vector-icons/MaterialIcons';

type PlaylistListNavigationProp = StackNavigationProp<RootStackParamList, 'PlaylistList'>;

type Props = {
  navigation: PlaylistListNavigationProp;
};

const PlaylistList = ({ navigation }: Props) => {
  const [playlists, setPlaylists] = useState<{ id: string; name: string; songs: Song[] }[]>([

  ]);

  const [modalVisible, setModalVisible] = useState(false); 
  const [playlistName, setPlaylistName] = useState(''); 

  const createPlaylist = () => {
    if (playlistName.trim()) {
      const newPlaylist = {
        id: String(playlists.length + 1),
        name: playlistName,
        songs: [],
      };
      setPlaylists([...playlists, newPlaylist]);
      setModalVisible(false);
      setPlaylistName('');
    }
  };

  return (
    <View style={styles.container}>
      {playlists.length === 0 ? (
        <View style={styles.centerContainer}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setModalVisible(true)}
          >
            <Icon name="add" size={24} color="#fff" />
            <Text style={styles.createButtonText}>Créer une playlist</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="add" size={24} color="#fff" />
          <Text style={styles.createButtonText}>Créer une playlist</Text>
        </TouchableOpacity>
      )}

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

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Créer une playlist</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom de la playlist"
              value={playlistName}
              onChangeText={setPlaylistName}
            />
         
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.createButtonModal]}
                onPress={createPlaylist}
              >
                <Text style={styles.buttonText}>Créer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButton: {
    flexDirection: 'row',
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  playlistItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
  },
  playlistText: {
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff', 
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
  },
 
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
  },

  button: {
    flex: 1, 
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5, 
  },

  cancelButton: {
    backgroundColor: 'rgba(173, 126, 133, 0.8)',
  },

  
  createButtonModal: {
    backgroundColor: 'rgba(151, 13, 151, 0.8)', 
  },

  buttonText: {
    color: '#fff', 
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PlaylistList;