
import TrackPlayer, { Capability, Event, State } from 'react-native-track-player';

export const setupPlayer = async () => {
  await TrackPlayer.setupPlayer();
  await TrackPlayer.updateOptions({
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.Stop,
    ],
    compactCapabilities: [Capability.Play, Capability.Pause],
    alwaysPauseOnInterruption: true,
  });

  TrackPlayer.addEventListener(Event.RemoteDuck, async (event) => {
    console.log('RemoteDuck event:', event);

    if (event.paused) {
      await TrackPlayer.pause();
    }
  });
};

export const playAudio = async (path: string) => {
  await TrackPlayer.reset();
  await TrackPlayer.add({
    id: path,
    url: path,
    title: 'Titre',
    artist: 'Artiste',
  });
  await TrackPlayer.play();
};