interface Subtitle {
  lang: string
  url: string
}

interface SubtitleChoicesProps {
  subtitles: Subtitle[]
  selectedUrl: string | null
  onSelect: (url: string | null) => void
}

function SubtitleChoices({ subtitles, selectedUrl, onSelect }: SubtitleChoicesProps) {
  if (subtitles.length === 0) return null

  return (
    <nav className="nav nav-pills" aria-label="Subtitles">
      <button type="button" className={`btn btn-link nav-link ${selectedUrl === null ? 'active' : ''}`} onClick={() => onSelect(null)}>
        Off
      </button>
      {subtitles.map(subtitle => (
        <button
          type="button"
          key={subtitle.url}
          className={`btn btn-link nav-link ${selectedUrl === subtitle.url ? 'active' : ''}`}
          onClick={() => onSelect(subtitle.url)}
        >
          {subtitle.lang}
        </button>
      ))}
    </nav>
  )
}

export default SubtitleChoices
