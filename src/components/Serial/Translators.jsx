import { useEffect, useState } from 'react'

function Translators ({ serialId, translatorId, onClickOnTranslator }) {
  const [translators, setTranslators] = useState([])

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/serial?id=${serialId}`).then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json()
    }).then(data => {
      setTranslators(data.translators)
    }).catch(() => {})
  }, [serialId])

  return (
    <>
      {translators.length > 0 && (
        <nav className="nav nav-pills">
          {translators.map(translator => (
            <a
              key={translator.id}
              className={`nav-link ${translatorId === translator.id ? 'active' : ''}`}
              href="#"
              onClick={() => {
                onClickOnTranslator(translator.id)
              }}
            >
              {translator.title}
            </a>
          ))}
        </nav>
      )}
    </>
  )
}

export default Translators