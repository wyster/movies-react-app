export function prepareUri(uri) {
  if (typeof uri === "object" && uri !== null) {
    return uri;
  }

  if (typeof uri !== 'string') {
    throw new Error('Uri is not has string type');
  }
  const regexp = /\[(.*?)](.*?) or (.*?)(?:,|$)/gm

  const matches = [...uri.matchAll(regexp)]
  return matches.map(match => {
    return {
      quality: match[1],
      playlist: match[2],
      video: match[3]
    }
  })
}
