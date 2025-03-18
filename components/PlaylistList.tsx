import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../src/navigationTypes';
import { Song } from '../src/navigationTypes';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

type PlaylistListNavigationProp = StackNavigationProp<RootStackParamList, 'PlaylistList'>;

type Props = {
  navigation: PlaylistListNavigationProp;
};

const PlaylistList = ({ navigation }: Props) => {
  const [playlists, setPlaylists] = useState<{ id: string; name: string; songs: Song[] }[]>([]);
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

  const deletePlaylist = (id: string) => {
    setPlaylists(playlists.filter(playlist => playlist.id !== id));
  };

  return (
    <View style={styles.container}>
      {playlists.length === 0 ? (
        <View style={styles.centerContainer}>
          <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
            <LinearGradient colors={['#9B59B6', '#FF69B4']} style={styles.createButtonGradient}>
              <Icon name="add" size={24} color="#fff" />
              <Text style={styles.createButtonText}>Créer une playlist</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
          <LinearGradient colors={['#9B59B6', '#FF69B4']} style={styles.createButtonGradient}>
            <Icon name="add" size={24} color="#fff" />
            <Text style={styles.createButtonText}>Créer une playlist</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.playlistItem}>
            {/* Icône cœur rose à gauche */}
            <TouchableOpacity>
              <Icon name="favorite" size={24} color="pink" style={styles.iconHeart} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.playlistTextContainer}
              onPress={() => navigation.navigate('PlaylistDetail', {
                playlistId: item.id,
                playlistName: item.name,
                songs: item.songs,
              })}
            >
              <Text style={styles.playlistText}>{item.name}</Text>
            </TouchableOpacity>

            {/* Icône poubelle grise à droite */}
            <TouchableOpacity onPress={() => deletePlaylist(item.id)}>
              <Icon name="delete" size={24} color="gray" style={styles.iconTrash} />
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal visible={modalVisible} transparent={true} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Créer une playlist</Text>
            <TextInput style={styles.input} placeholder="Nom de la playlist" value={playlistName} onChangeText={setPlaylistName} />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.createButtonModal]} onPress={createPlaylist}>
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
    backgroundColor: 'rgb(25, 2, 39)',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButton: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  createButtonGradient: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    width: '100%',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginBottom: 10,
    borderRadius: 8,
  },
  playlistTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  playlistText: {
    fontSize: 16,
    color: 'rgb(250, 249, 249)',
  },
  iconHeart: {
    marginRight: 10,
  },
  iconTrash: {
    marginLeft: 10,
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(114, 107, 107, 0.8)',
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
    color: 'rgb(255, 255, 255)',
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
    backgroundColor: 'rgba(90, 89, 90, 0.8)',
  },
  createButtonModal: {
    backgroundColor: 'rgba(90, 89, 90, 0.8)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PlaylistList;
