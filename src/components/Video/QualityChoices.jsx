function QualityChoices({qualities, quality, onClickOnQuality}) {
  return (
    <>
      {qualities.length > 0 && (
        <>
          <nav className="nav nav-pills">
            {qualities.map(item => (
              <button
                type="button"
                key={item.quality}
                className={`btn btn-link nav-link ${quality === item.quality ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  onClickOnQuality(item.quality)
                }}
              >
                {item.quality}
              </button>
            ))}
          </nav>
        </>
      )}
    </>
  )
}

export default QualityChoices;