import { useEffect, useState } from 'react'

function SerialTranslators ({ serialId, onClickOnTranslator }) {
  const [translators, setTranslators] = useState([])

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/serial?id=${serialId}`).then(response => {
      return response.json()
    }).then(data => {
      setTranslators(data.translators);
    })
  }, [serialId])

  return (
    <div>
      <p>Serial translations</p>
      {translators.length > 0 && (
        <ul>
          {translators.map(translator => (
            <li key={translator.id}>
              <a href="javascript:;" onClick={() => onClickOnTranslator(translator.id)}>{translator.title}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SerialTranslators