import { useEffect, useRef, useState } from 'react'
import video from 'video.js';
import 'video.js/dist/video-js.css';

function Player ({
  src,
  currentTime = null,
  volume = null,
  onCurrentTimeChange = () => {},
  onChangeVolume = () => {},
  onEnded = () => {},
  autoPlay = false
}) {
  const videoElement = useRef()
  const videoContainer = useRef()
  const [timer, setTimer] = useState(null)
  const [player, setPlayer] = useState(null);

  function timeUpdate (e) {
    const value = parseInt(e.target.currentTime, 10)
    setTimer(current => {
      if (value === current) {
        return current
      }

      return value
    })
  }

  function volumeChange (e) {
    onChangeVolume(parseInt(e.target.volume * 100, 10))
  }

  function ended (e) {
    onEnded(parseInt(e.target.currentTime, 10))
  }

  useEffect(() => {
    const $video = videoElement.current

    const player = video($video, {
      fluid: true
    });

    setPlayer(player);

    return () => {
      player.dispose();
    }

  }, [])

  useEffect(() => {
    if (!player) {
      return;
    }

    player.src({type: 'video/mp4', src});

    if (autoPlay) {
      player.play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, player])

  useEffect(() => {
    if (!videoElement.current || !videoElement.current.paused) {
      return
    }
    videoElement.current.currentTime = currentTime
  }, [currentTime])

  useEffect(() => {
    if (timer === null) {
      return
    }

    onCurrentTimeChange(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer])

  useEffect(() => {
    if (volume === null || !videoElement.current) {
      return
    }
    videoElement.current.volume = volume / 100
  }, [volume])

  return (
    <>
      <div ref={videoContainer} data-vjs-player>
        <video
          ref={videoElement}
          className="video-js"
          controls
          onEnded={ended}
          onTimeUpdate={timeUpdate}
          onVolumeChange={volumeChange}
        />
      </div>
    </>
  )
}

export default Player