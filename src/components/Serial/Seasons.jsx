function Seasons({seasons, seasonId, onClickOnSeason}) {
  return (
    <>
      {seasons.length > 0 && (
        <>
          <nav className="nav nav-pills">
            {seasons.map(item => (
              <button
                key={item.id}
                className={`btn btn-link nav-link ${seasonId === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
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

export default Seasons;