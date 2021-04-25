import { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { usePlayer } from '../../contexts/PlayerContext';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export const Player = () => {

    const { currentEpisodeIndex,
            episodeList,
            isPlaying,
            togglePlay,
            setPlayingState,
            playPrevious,
            playNext,
            hasPrevious,
            hasNext,
            toggleLooping,
            isLooping,
            toggleShuffling,
            isShuffling,
            clearPlayerState,
          } = usePlayer();

    const [ progress, setProgress ] = useState(0);

    const setupProgressListener = () => {
        audioRef.current.currentTime = 0;
        audioRef.current.addEventListener('timeupdate', event => {
            setProgress(Math.floor(audioRef.current.currentTime));
        });
    }

    const handleSeek = (amount: number) => {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    const audioRef = useRef<HTMLAudioElement>(null);

    const episode = episodeList[currentEpisodeIndex];

    const handleEpisodeEnding = () => {
        if (hasNext) {
            playNext();
        } else {
            clearPlayerState();
        }
    }

    useEffect(() => {
        if (!audioRef.current) {
            return;
        }

        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }

    }, [isPlaying])

    return (<div className={styles.playerContainer}>
        <header>
            <img src="/playing.svg" alt="Tocando agora" />
            <strong>Tocando agora</strong>
        </header>

        {!episode ? (
            <div className={styles.emptyPlayer}>
                <strong>Selecione um conteúdo para ouvir</strong>
            </div>
            ) : (
            <div className={styles.currentEpisode}>
                <Image width={592} height={592} src={episode.thumbnail} objectFit="cover" />
                <strong>{episode.title}</strong>
                <span>{episode.members}</span>
            </div>
            )
        }

        {episode && (
            <audio ref={audioRef}
                   src={episode.url}
                   loop={isLooping}
                   autoPlay
                   onLoadedMetadata={setupProgressListener}
                   onEnded={handleEpisodeEnding}
                   onPlay={() => setPlayingState(true)}
                   onPause={() => setPlayingState(false)} />
        )}

        <footer className={!episode ? styles.empty : ''}>
            <div className={styles.progress}>
                <span>{convertDurationToTimeString(progress)}</span>
                <div className={styles.slider}>
                    {episode ? <Slider max={episode.duration}
                                       value={progress}
                                       onChange={handleSeek}
                                       trackStyle={{ backgroundColor: '#84d361' }}
                                       railStyle={{ backgroundColor: '#9f75ff' }}
                                       handleStyle={{ borderColor: '#84d361', borderWidth: 4 }} /> : <div className={styles.emptySlider} />}
                </div>
                <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
            </div>
            <div className={styles.buttons}>
                <button type="button"
                        disabled={ !episode || episodeList.length == 1 }
                        onClick={toggleShuffling}
                        className={isShuffling ? styles.isActive : ''}>
                            <img src="/shuffle.svg" alt="Aleatório" />
                        </button>
                <button type="button" disabled={!episode || !hasPrevious } onClick={playPrevious}>
                    <img src="/play-previous.svg" alt="Voltar" />
                </button>
                <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}>
                    {isPlaying ? <img src="/pause.svg" alt="Pausar" /> : <img src="/play.svg" alt="Tocar" />}
                </button>
                <button type="button" disabled={!episode || !hasNext } onClick={playNext}>
                    <img src="/play-next.svg" alt="Próxima" />
                </button>
                <button
                    type="button"
                    onClick={toggleLooping}
                    className={isLooping ? styles.isActive : '' }
                    disabled={!episode}>
                        <img src="/repeat.svg" alt="Repetir" />
                </button>
            </div>
        </footer>
    </div>);
}