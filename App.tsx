import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AudioList from './components/AudioList';
import AudioPlayerPage from './components/AudioPlayerPage';
import PlaylistList from './components/PlaylistList';
import PlaylistDetail from './components/PlaylistDetail';
import SongSelector from './components/SongSelector';
import { RootStackParamList } from './src/navigationTypes';
import TrackPlayer from 'react-native-track-player';

TrackPlayer.setupPlayer().then(() => {
  console.log("TrackPlayer est prêt !");
});


const Stack = createStackNavigator<RootStackParamList>();

const DarkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#1A0734',
    text: '#FFFFFF',
  },
};

const App = () => {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#1A0734' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
        <Stack.Screen name="AudioList" component={AudioList} options={{ title: 'List Audio' }} />
        <Stack.Screen name="AudioPlayerPage" component={AudioPlayerPage} options={{ title: 'Audio Player' }} />
        <Stack.Screen name="PlaylistList" component={PlaylistList} options={{ title: 'Listes de lecture' }} />
        <Stack.Screen name="PlaylistDetail" component={PlaylistDetail} options={{ title: 'Détails de la playlist' }} />
        <Stack.Screen name="SongSelector" component={SongSelector} options={{ title: 'Sélectionner des chansons' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
