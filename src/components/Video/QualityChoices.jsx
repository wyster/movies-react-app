function QualityChoices({qualities, quality, onClickOnQuality}) {
  return (
    <>
      {qualities.length > 0 && (
        <>
          <nav className="nav nav-pills">
            {qualities.map(item => (
              <a
                key={item.quality}
                className={`nav-link ${quality === item.quality ? 'active' : ''}`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onClickOnQuality(item.quality)
                }}
              >
                {item.quality}
              </a>
            ))}
          </nav>
        </>
      )}
    </>
  )
}

export default QualityChoices;