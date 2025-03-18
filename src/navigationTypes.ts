
export type RootStackParamList = {
    AudioListScreen: undefined;
    Home: undefined;
    AudioPlayerScreen: { song: { id: string; title: string; artist: string; path: string } }; 
    AudioList: undefined;
    AudioPlayerPage: { song: Song; songs: Song[], songsList: Song[]};
    PlaylistList: undefined;
    PlaylistDetail: { playlistId: string; playlistName: string; songs: Song[] };
  };
 
export type Song = {
    id: string;
    title: string;
    artist: string;
    path: string;
  };
  