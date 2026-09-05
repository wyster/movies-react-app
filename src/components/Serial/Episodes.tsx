interface Episode {
  episode: number
  title: string
}

interface EpisodesProps {
  episodes?: Episode[]
  episodeId: number
  onClickOnEpisode?: (episodeId: number) => void
}

function Episodes({
  episodes = [],
  episodeId,
  onClickOnEpisode = () => {},
}: EpisodesProps) {
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
                onClick={(event) => {
                  event.preventDefault()
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

export default Episodes
