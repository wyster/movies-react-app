import { useEffect, useState } from 'react'

interface CastController {
  on: (event: string, handler: () => void) => void
  time: () => number
  state: string
}

function useCast() {
  const [cast, setCast] = useState<CastController | null>(null)
  const [paused, setPaused] = useState(false)
  const [timer, setTimer] = useState<number | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (cast === null) {
      setConnected(false)
      return
    }

    function connect() {
      setConnected(true)
    }

    function pause() {
      setPaused(true)
    }

    function playing() {
      setPaused(false)
    }

    cast.on('connect', connect)
    cast.on('pause', pause)
    cast.on('playing', playing)
    cast.on('timeupdate', () => setTimer(cast.time()))
    cast.on('event', () => {
      if (cast.state === 'playing') setPaused(false)
      if (cast.state === 'paused') setPaused(true)
    })
  }, [cast])

  return {
    cast,
    setCast,
    myCast: { paused, timer, connected },
  }
}

export default useCast
