function Episodes({
  episodes = [],
  episodeId,
  onClickOnEpisode = () => {}
}) {
  return (
    <>
      {episodes.length > 0 && (
        <>
          <nav className="nav nav-pills">
            {episodes.map(item => (
              <a
                key={item.episode}
                className={`nav-link ${episodeId === item.episode ? 'active' : ''}`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onClickOnEpisode(item.episode)
                }}
              >
                {item.title}
              </a>
            ))}
          </nav>
        </>
      )}
    </>
  )
}

export default Episodes;