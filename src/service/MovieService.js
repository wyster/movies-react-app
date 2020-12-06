export async function getMovieDetails(id) {
  return await fetch(`${process.env.REACT_APP_API_URL}/details?id=${id}`).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json()
  }).catch(e => {
    throw e
  });
}

export async function findMovieId(url) {
  return await fetch(`${process.env.REACT_APP_API_URL}/id-from-url?url=${url}`).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json()
  }).catch(e => {
    throw e
  });
}

export async function getTranslators(id) {
  return await fetch(`${process.env.REACT_APP_API_URL}/serial?id=${id}`).then(response => {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json()
  }).catch(e => {
    throw e
  });
}