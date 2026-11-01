import { useQuery } from '@tanstack/react-query'
import { getMovieDetails } from '../../api'
import { VideoSkin, Video, VideoPlayer } from '@videojs/react/video'
import { CastButton } from '@videojs/react'
import { GoogleCast } from '@videojs/react/extensions/google-cast'


interface MovieData {
  isSerial: boolean
  name: string
  description: string
  poster: string
  year: number
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
  season?: number | null
  episode?: number | null
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
  season = null,
  episode = null,
}: PlayerProps) {
  const { data: movieData } = useQuery<MovieData>({ queryKey: ['movie-details', movieId], queryFn: () => getMovieDetails(movieId) })
  const castTitle = (() => {
    if (!movieData) return undefined

    if (!movieData.isSerial) {
      return `${movieData.name} (${movieData.year})`
    }

    const seasonTitle = season !== null ? ` — Season ${season}` : ''
    const episodeTitle = episode !== null ? `, Episode ${episode}` : ''

    return `${movieData.name} (${movieData.year})${seasonTitle}${episodeTitle}`
  })()

  return (
    <>
        <VideoPlayer>
          <VideoSkin>
            <Video src={src} playsInline autoPlay={autoPlay} poster={movieData?.poster}>
              <GoogleCast />
              <CastButton
                render={(props, state) => (
                  <button {...props} aria-label={state.connection === 'connected' ? 'Stop casting' : 'Cast'}>
                    {state.connection === 'connected' ? 'Stop casting' : 'Cast'}
                  </button>
                )}
              />
            </Video>
          </VideoSkin>
        </VideoPlayer>
    </>
  )
}

export default Player
