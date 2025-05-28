import { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../assets/assets";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();

  const [track, setTrack] = useState(songsData[1]);
  const [playStatus, setPlayStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: { second: 0, minute: 0 },
    totalTime: { second: 0, minute: 0 },
  });

  const play = () => {
    audioRef.current.play();
    setPlayStatus(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  };

  // Khi thay đổi track chỉ setTrack thôi
  const playWithId = (id) => {
    setTrack(songsData[id]);
  };

  const previous = () => {
    if (track.id > 0) {
      setTrack(songsData[track.id - 1]);
    }
  };

  const next = () => {
    if (track.id < songsData.length - 1) {
      setTrack(songsData[track.id + 1]);
    }
  };

  const seekSong = (e) => {
    const percent = e.nativeEvent.offsetX / seekBg.current.offsetWidth;
    audioRef.current.currentTime = percent * audioRef.current.duration;
  };

  // Effect này chạy khi track thay đổi, sẽ load lại audio và play khi sẵn sàng
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Tải lại track
    audio.load();

    // Khi audio sẵn sàng phát thì gọi play()
    const onCanPlay = () => {
      audio.play().catch((err) => {
        console.warn("Playback error:", err);
      });
      setPlayStatus(true);
    };

    audio.addEventListener("canplay", onCanPlay);

    // Xử lý update thanh seek và thời gian
    const handleTimeUpdate = () => {
      if (audio.duration) {
        seekBar.current.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
        setTime({
          currentTime: {
            second: Math.floor(audio.currentTime % 60),
            minute: Math.floor(audio.currentTime / 60),
          },
          totalTime: {
            second: Math.floor(audio.duration % 60),
            minute: Math.floor(audio.duration / 60),
          },
        });
      }
    };
    audio.addEventListener("timeupdate", handleTimeUpdate);

    // Cleanup event listeners khi component unmount hoặc track thay đổi
    return () => {
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [track]);

  const contextValue = {
    audioRef,
    seekBar,
    seekBg,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    play,
    pause,
    playWithId,
    previous,
    next,
    seekSong,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      <audio ref={audioRef} src={track.file} />
      {props.children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
