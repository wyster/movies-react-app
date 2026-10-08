interface Translator {
  id: number
  title: string
  isDirector: boolean
}

interface TranslatorsProps {
  translators: Translator[]
  translatorId: number | null | undefined
  onClickOnTranslator: (translatorId: Translator) => void
}

function Translators({
  translators,
  translatorId,
  onClickOnTranslator,
}: TranslatorsProps) {
  return (
    <>
      {translators.length > 0 && (
        <nav className="nav nav-pills">
          {translators.map(translator => (
            <button
              type="button"
              key={translator.id}
              className={`btn btn-link nav-link ${translatorId === translator.id ? 'active' : ''}`}
              onClick={(event) => {
                event.preventDefault()
                onClickOnTranslator(translator)
              }}
            >
              {translator.title}
            </button>
          ))}
        </nav>
      )}
    </>
  )
}

export default Translators
