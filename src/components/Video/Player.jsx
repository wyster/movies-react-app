function Player({src}) {
  return (
    <>
      <video controls key={src} style={{width: '100%', height: '100%'}}>
        <source src={src}/>
      </video>
    </>
  )
}

export default Player;