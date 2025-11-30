import {useEffect, useState} from "react";

function useCast () {
  const [cast, setCast] = useState(null)
  const [paused, setPaused] = useState(false)
  const [timer, setTimer] = useState(null)


  useEffect(() => {
    if (cast === null) {
      return;
    }

    function connect(cast) {
      cast._isMediaLoadedChanged().then(() => {
        setPaused(cast.paused);
      })
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

    return () => {
      cast.off(connect);
      cast.off(pause);
      cast.off(playing)
      cast.off(timeUpdate)
    };
  }, [cast]);

  return {
    myCast: cast,
    setMyCast: setCast,
    paused,
    timer
  }
}

export default useCast
