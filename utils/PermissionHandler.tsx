
import React from 'react';
import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';

export const checkStoragePermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;

  try {
    let permission;
    if (Platform.Version >= 33) {
      permission = PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO;
    } else {
      permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
    }

    const hasPermission = await PermissionsAndroid.check(permission);
    console.log('Permission accordée ?', hasPermission);
    return hasPermission;
  } catch (error) {
    console.error('Erreur lors de la vérification de la permission :', error);
    return false;
  }
};

export const requestStoragePermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;

  try {
    let permission;
    if (Platform.Version >= 33) {
      permission = PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO;
    } else {
      permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
    }

    const granted = await PermissionsAndroid.request(permission, {
      title: 'Permission de stockage',
      message:
        'Cette application a besoin d’accéder à votre stockage pour lire les fichiers audio.',
      buttonNeutral: 'Demander plus tard',
      buttonNegative: 'Annuler',
      buttonPositive: 'OK',
    });

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      Alert.alert(
        'Permission refusée',
        'Vous avez refusé la permission d’accéder au stockage. Veuillez l’activer manuellement dans les paramètres.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Ouvrir les paramètres', onPress: () => Linking.openSettings() },
        ],
      );
    }

    return false;
  } catch (error) {
    console.error('Erreur lors de la demande de permission :', error);
    return false;
  }
};