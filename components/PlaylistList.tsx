import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../src/navigationTypes';
import { Song } from '../src/navigationTypes';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Pour l'icône "+"

type PlaylistListNavigationProp = StackNavigationProp<RootStackParamList, 'PlaylistList'>;

type Props = {
  navigation: PlaylistListNavigationProp;
};

const PlaylistList = ({ navigation }: Props) => {
  const [playlists, setPlaylists] = useState<{ id: string; name: string; songs: Song[] }[]>([
    // Exemple de playlists existantes (vide par défaut)
  ]);

  const [modalVisible, setModalVisible] = useState(false); // Pour afficher/masquer la modal
  const [playlistName, setPlaylistName] = useState(''); // Pour stocker le nom de la nouvelle playlist

  // Créer une nouvelle playlist
  const createPlaylist = () => {
    if (playlistName.trim()) {
      const newPlaylist = {
        id: String(playlists.length + 1), // Générer un ID unique
        name: playlistName,
        songs: [],
      };
      setPlaylists([...playlists, newPlaylist]);
      setModalVisible(false); // Fermer la modal
      setPlaylistName(''); // Réinitialiser le champ de saisie
    }
  };

  return (
    <View style={styles.container}>
      {/* Afficher le bouton au centre si aucune playlist n'existe, sinon en haut */}
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

      {/* Liste des playlists */}
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
            {/* Boutons alignés en ligne */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]} // Style pour Annuler
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.createButtonModal]} // Style pour Créer
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fond semi-transparent
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff', // Fond clair pour la modal
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333', // Texte sombre
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
  },
  // Conteneur pour aligner les boutons en ligne
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Espacement entre les boutons
    marginTop: 16,
  },

  // Style de base pour les boutons
  button: {
    flex: 1, // Prendre autant d'espace que possible
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5, // Espacement entre les boutons
  },

  cancelButton: {
    backgroundColor: 'rgba(173, 126, 133, 0.8)',
  },

  // Style spécifique pour le bouton Créer (violet avec opacité)
  createButtonModal: {
    backgroundColor: 'rgba(151, 13, 151, 0.8)', // Violet avec 70% d'opacité
  },

  // Style du texte des boutons (inchangé)
  buttonText: {
    color: '#fff', // Texte blanc
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PlaylistList;