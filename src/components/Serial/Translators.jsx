import { useEffect, useState } from 'react'
import { getTranslators } from '../../service/MovieService'

function Translators ({ serialId, translatorId, onClickOnTranslator }) {
  const [translators, setTranslators] = useState([])

  useEffect(() => {
    getTranslators(serialId).then(data => {
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
              onClick={e => {
                e.preventDefault();
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