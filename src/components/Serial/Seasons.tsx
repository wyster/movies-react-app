interface Season {
  id: number
  title: string
}

interface SeasonsProps {
  seasons: Season[]
  seasonId: number
  onClickOnSeason: (seasonId: number) => void
}

function Seasons({ seasons, seasonId, onClickOnSeason }: SeasonsProps) {
  return (
    <>
      {seasons.length > 0 && (
        <>
          <nav className="nav nav-pills">
            {seasons.map(item => (
              <button
                key={item.id}
                className={`btn btn-link nav-link ${seasonId === item.id ? 'active' : ''}`}
                onClick={(event) => {
                  event.preventDefault()
                  onClickOnSeason(item.id)
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

export default Seasons
