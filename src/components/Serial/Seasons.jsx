function Seasons({seasons, seasonId, onClickOnSeason}) {
  return (
    <>
      {seasons.length > 0 && (
        <>
          <nav className="nav nav-pills">
            {seasons.map(item => (
              <a
                key={item.id}
                className={`nav-link ${seasonId === item.id ? 'active' : ''}`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onClickOnSeason(item.id)
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

export default Seasons;