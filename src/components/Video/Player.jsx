import { useEffect, useRef, useState } from 'react'

function Player ({
  src,
  currentTime = null,
  volume = null,
  onCurrentTimeChange = () => {},
  onChangeVolume = () => {}
}) {
  const videoElement = useRef()
  const [timer, setTimer] = useState(null)

  useEffect(() => {
    if (!videoElement.current.paused) {
      return
    }
    videoElement.current.currentTime = currentTime
  }, [currentTime])

  useEffect(() => {
    if (timer === null) {
      return;
    }

    onCurrentTimeChange(timer);
  }, [timer]);

  useEffect(() => {
    videoElement.current.addEventListener('timeupdate', () => {
      const value = parseInt(videoElement.current.currentTime, 10)
      setTimer(current => {
        if (value === current) {
          return current;
        }

        return value;
      })
    })
    videoElement.current.addEventListener('volumechange', e => {
      onChangeVolume(parseInt(e.target.volume * 100, 10));
    })
  }, [src])

  useEffect(() => {
    if (volume === null) {
      return
    }
    videoElement.current.volume = volume / 100
  }, [volume])

  return (
    <>
      <video
        ref={videoElement}
        controls
        key={src}
        style={{ width: '100%', height: '100%' }}
      >
        <source src={src}/>
      </video>
    </>
  )
}

export default Player