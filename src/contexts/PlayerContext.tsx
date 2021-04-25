import { createContext, useState, ReactNode, useContext } from 'react';
import Episode from '../pages/episodes/[slug]';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerCtx = {
    episodeList: Array<Episode>;
    currentEpisodeIndex: number;
    isPlaying: boolean;
    play: (episode: Episode) => void;
    playPrevious: () => void;
    playNext: () => void;
    playList: (list: Episode[], index: number) => void;
    isLooping: boolean;
    toggleLooping: () => void;
    isShuffling: boolean;
    toggleShuffling: () => void;
    hasPrevious: boolean;
    hasNext: boolean;
    togglePlay: () => void;
    setPlayingState: (state: boolean) => void;
    clearPlayerState: () => void;
}

type PlayerContentProviderProps = {
    children: ReactNode,
}

export const PlayerContext = createContext({} as PlayerCtx);

export const usePlayer = () => {
    return useContext(PlayerContext);
}

export const PlayerContextProvider = ({ children }: PlayerContentProviderProps) => {

  const [ episodeList, setEpisodeList ] = useState([]);
  const [ currentEpisodeIndex, setCurrentEpisodeIndex ] = useState(0);
  const [ isPlaying, setIsPlaying ] = useState(false);
  const [ isLooping, setLooping ] = useState(false);
  const [ isShuffling, setShuffle ] = useState(false);

  const play = (episode: Episode) => {
    setEpisodeList([episode]);
    setIsPlaying(true);
    setCurrentEpisodeIndex(0);
  }

  const playList = (list: Episode[], index: number) => {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  const togglePlay = () => {
    setIsPlaying(() => !isPlaying);
  }

  const setPlayingState = (state: boolean) => {
    setIsPlaying(state);
  }

  const toggleLooping = () => {
      setLooping(() => !isLooping);
  }

  const toggleShuffling = () => {
      setShuffle(() => !isShuffling);
  }

  const clearPlayerState = () => {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  const hasNext = isShuffling || currentEpisodeIndex < episodeList.length - 1;

  const hasPrevious = currentEpisodeIndex > 0;

   const playNext = () => {

    if (isShuffling) {
        const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
        setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if (hasNext) {
        setCurrentEpisodeIndex(() => currentEpisodeIndex + 1);
    }
  }

  const playPrevious = () => {
   if (hasPrevious) {
        setCurrentEpisodeIndex(() => currentEpisodeIndex - 1);
    }
  }

  return (<PlayerContext.Provider
                value={{ episodeList,
                         currentEpisodeIndex,
                         play,
                         playPrevious,
                         playNext,
                         playList,
                         toggleLooping,
                         isLooping,
                         isShuffling,
                         toggleShuffling,
                         hasPrevious,
                         hasNext,
                         isPlaying,
                         togglePlay,
                         setPlayingState,
                         clearPlayerState
                       }}>
      {children}
  </PlayerContext.Provider>);
}