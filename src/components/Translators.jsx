function Translators ({ translators, translatorId, onClickOnTranslator }) {
  return (
    <>
      {translators.length > 0 && (
        <nav className="nav nav-pills">
          {translators.map(translator => (
            <button
              type="button"
              key={translator.id}
              className={`btn btn-link nav-link ${translatorId === translator.id ? 'active' : ''}`}
              onClick={e => {
                e.preventDefault();
                onClickOnTranslator(translator.id)
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