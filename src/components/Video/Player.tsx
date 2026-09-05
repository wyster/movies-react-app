import { useEffect, useRef, useState } from 'react'
import Cast from '../../utils/Cast'
import { useQuery } from '@tanstack/react-query'
import { getMovieDetails } from '../../api'
import useCast from '../../hooks/cast'
import { VideoSkin, Video, VideoPlayer } from '@videojs/react/video'


interface MovieData {
  name: string
  description: string
  poster: string
}

interface PlayerProps {
  movieId: number
  src?: string
  currentTime?: number | null
  volume?: number | null
  onCurrentTimeChange?: (time: number) => void
  onChangeVolume?: (volume: number) => void
  onEnded?: () => void
  autoPlay?: boolean
}

function Player({
  movieId,
  src,
  currentTime = null,
  volume = null,
  onCurrentTimeChange = () => {},
  onChangeVolume = () => {},
  onEnded = () => {},
  autoPlay = false,
}: PlayerProps) {
  const videoElement = useRef<HTMLElement | null>(null)
  const videoContainer = useRef<HTMLDivElement | null>(null)
  const [timer, setTimer] = useState<number | null>(null)
  const { cast: myCastJs, myCast, setCast } = useCast() as any
  const { data: movieData } = useQuery<MovieData>({ queryKey: ['movie-details', movieId], queryFn: () => getMovieDetails(movieId) })

  function cast() {
    if (myCast.connected) {
      if (myCastJs.src === src) {
        myCastJs.play()
        return
      }
      if (currentTime) myCastJs.seek(currentTime)
      myCastJs.cast(src, {
        poster: movieData?.poster,
        title: movieData?.name,
        description: movieData?.description,
      })
      return
    }

    const castInstance: any = new (Cast as any)({ joinpolicy: 'origin_scoped' })
    castInstance.on('event', (event: string) => {
      if (event === 'disconnect') {
        setTimer(castInstance.time)
        setCast(null)
      }
      if (event === 'session_error') setCast(null)
      console.log('event:', event, 'state:', castInstance.state)
    })
    castInstance.on('error', (event: unknown) => console.log(event))
    castInstance.on('disconnect', (event: unknown) => {
      console.log(event, 'disconnect')
      setCast(null)
    })
    castInstance.on('available', (event: unknown) => {
      console.log(event, 'available')
      castInstance.time = currentTime
      castInstance.cast(src, {
        poster: movieData?.poster,
        title: movieData?.name,
        description: movieData?.description,
      })
    })
    setCast(castInstance)
  }

  useEffect(() => {
    if (myCast.paused) setTimer(myCast.timer)
  }, [myCast.paused, myCast.timer])

  function run() {
    const castInstance: any = new (Cast as any)({ joinpolicy: 'origin_scoped' })
    castInstance.on('event', (event: string) => {
      console.log('event:', event, 'state:', castInstance.state)
    })
    castInstance.on('error', (event: unknown) => console.log(event))
    setCast(castInstance)
  }

  return (
    <>
      <button type="button" className="btn" onClick={event => { event.preventDefault(); cast() }}>
        Cast
      </button>
      {currentTime !== null && currentTime > 0 && (
        <span className="badge rounded-pill bg-secondary" onClick={() => myCast.timer ? setTimer(myCast.timer) : null} title="Update current time">
          Current time {currentTime} sec
        </span>
      )}
      <div>
        {!myCast.connected && <button type="button" className="btn" onClick={event => { event.preventDefault(); run() }}>Connect to cast</button>}
        {myCast.connected && <button type="button" className="btn" onClick={() => myCast.paused ? myCastJs.play() : myCastJs.pause()}>{myCast.paused ? 'Play' : 'Pause'}</button>}
        {myCast.connected && <button type="button" className="btn" onClick={() => myCastJs.disconnect()}>Disconnect</button>}
      </div>
      <div ref={videoContainer}>
        <VideoPlayer>
          <VideoSkin>
            <Video src={src} playsInline />
          </VideoSkin>
        </VideoPlayer>
      </div>
    </>
  )
}

export default Player
