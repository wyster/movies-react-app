import {useEffect, useState} from "react";

function useCast () {
  const [cast, setCast] = useState(null)
  const [paused, setPaused] = useState(false)
  const [timer, setTimer] = useState(null)
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (cast === null) {
      setConnected(false);
      return;
    }

    function connect(cast) {
      setConnected(true);
      /*cast._isMediaLoadedChanged().then(() => {
        setPaused(cast.paused);
      })*/
    }
    function pause() {
      setPaused(true);
    }
    function playing() {
      setPaused(false);
    }
    function timeUpdate(time) {
      setTimer(time);
    }
    cast.on('connect', () => connect(cast));
    cast.on('pause', pause)
    cast.on('playing', playing)
    cast.on('timeupdate', () => timeUpdate(cast.time))
    cast.on('event', () => {
      if (cast.state === 'playing') {
        setPaused(false);
      }
      if (cast.state === 'paused') {
        setPaused(true);
      }
    });

    /*return () => {
      cast.off(connect);
      cast.off(pause);
      cast.off(playing)
      cast.off(timeUpdate)
    };*/
  }, [cast]);

  return {
    cast,
    setCast,
    myCast: {
      paused,
      timer,
      connected
    }
  }
}

export default useCast
