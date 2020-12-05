import { useEffect, useRef, useState } from 'react'

function Player ({
  src,
  currentTime = null,
  volume = null,
  onCurrentTimeChange = () => {},
  onChangeVolume = () => {},
  onEnded = () => {},
  autoPlay = false,
  fullScreen = false
}) {
  const videoElement = useRef()
  const [timer, setTimer] = useState(null)

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
    if (!videoElement.current || !autoPlay) {
      return
    }
    const promise = videoElement.current.play()
    if (promise !== undefined) {
      promise.then(_ => {
        // Autoplay started!
      }).catch(e => {
        console.error(e)
      })
    }
  }, [src])

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

  useEffect(() => {
    if (fullScreen === false || !videoElement.current) {
      return
    }
    videoElement.current.requestFullscreen()
      .then(_ => {
        // Full screen started!
      })
      .catch(e => {
        console.error(e)
      })
  }, [src])

  return (
    <>
      <video
        ref={videoElement}
        controls
        key={src}
        style={{ width: '100%', height: '100%' }}
        onEnded={ended}
        onTimeUpdate={timeUpdate}
        onVolumeChange={volumeChange}
      >
        <source src={src}/>
      </video>
    </>
  )
}

export default Player