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
              <button
                type="button"
                key={item.episode}
                className={`btn btn-link nav-link ${episodeId === item.episode ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  onClickOnEpisode(item.episode)
                }}
              >
                {item.title}
              </button>
            ))}
          </nav>
        </>
      )}
    </>
  )
}

export default Episodes;