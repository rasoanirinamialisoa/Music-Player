import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AudioList from './components/AudioList';
import AudioPlayerPage from './components/AudioPlayerPage';
import { RootStackParamList } from './src/navigationTypes';
import TrackPlayer from 'react-native-track-player';

TrackPlayer.setupPlayer().then(async () => {
  console.log("TrackPlayer est prêt !");
});


const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AudioList">
        <Stack.Screen
          name="AudioList"
          component={AudioList}
          options={{ title: 'List Audio' }}
        />
        <Stack.Screen
          name="AudioPlayerPage"
          component={AudioPlayerPage}
          options={{ title: 'Audio Player' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;