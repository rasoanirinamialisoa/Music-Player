
import RNFS from 'react-native-fs';

type Song = {
  id: string;
  title: string;
  artist: string;
  path: string;
};

export const listAudioFiles = async (): Promise<Song[]> => {
  const path = RNFS.ExternalStorageDirectoryPath + '/Music';
  console.log('Chemin du dossier :', path);

  try {
    const files = await RNFS.readDir(path);
    console.log('Fichiers trouvés :', files);

    const audioFiles = files
      .filter((file) => file.isFile() && (file.name.endsWith('.mp3') || file.name.endsWith('.m4a')))
      .map((file) => ({
        id: file.path,
        title: file.name,
        artist: 'Inconnu',
        path: file.path,
      }));

    console.log('Fichiers audio trouvés :', audioFiles);
    return audioFiles;
  } catch (error) {
    console.error('Erreur lors de la lecture des fichiers audio :', error);
    return [];
  }
};