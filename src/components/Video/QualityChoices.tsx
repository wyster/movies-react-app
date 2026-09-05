interface Quality {
  quality: string
}

interface QualityChoicesProps {
  qualities: Quality[]
  quality: string
  onClickOnQuality: (quality: string) => void
}

function QualityChoices({
  qualities,
  quality,
  onClickOnQuality,
}: QualityChoicesProps) {
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
                onClick={(event) => {
                  event.preventDefault()
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

export default QualityChoices
