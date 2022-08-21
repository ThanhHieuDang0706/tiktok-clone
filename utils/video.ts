export function onVideoClickHandler(
  playing: boolean,
  videoRef: React.RefObject<HTMLVideoElement>,
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>
) {
  return () => {
    if (playing) {
      videoRef?.current?.pause();
      setPlaying(false);
    } else {
      videoRef?.current?.play();
      setPlaying(true);
    }
  };
}
