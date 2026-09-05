export interface PreparedUri {
  quality: string
  playlist: string
  video: string
}

export function prepareUri(uri: string): PreparedUri[] {
  const regexp = /\[(.*?)](.*?) or (.*?)(?:,|$)/gm

  return [...uri.matchAll(regexp)].map(match => ({
    quality: match[1],
    playlist: match[2],
    video: match[3],
  }))
}
