
export type RootStackParamList = {
    AudioListScreen: undefined; 
    AudioPlayerScreen: { song: { id: string; title: string; artist: string; path: string } }; 
    AudioList: undefined;
    AudioPlayerPage: { song: Song; songs: Song[], songsList: Song[]  }; 
  };
 
export type Song = {
    id: string;
    title: string;
    artist: string;
    path: string;
  };
  