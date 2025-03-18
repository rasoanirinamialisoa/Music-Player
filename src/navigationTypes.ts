
export type RootStackParamList = {
    AudioListScreen: undefined;
    Home: undefined;
    AudioPlayerScreen: { song: { id: string; title: string; artist: string; path: string } }; 
    AudioList: {fromPlaylist: boolean}
    AudioPlayerPage: { song: Song; songs: Song[], songsList: Song[]};
    PlaylistList: undefined;
    PlaylistDetail: { playlistId: string; playlistName: string; songs: Song[];  selectedSongs?: Song[] };
    PlaylistDetails: { playlistName: string };
    SongSelector: { playlistName: string }; 
   
  };
 
export type Song = {
    id: string;
    title: string;
    artist: string;
    path: string;
  };
  