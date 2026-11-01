export interface Translator {
  id: number
  title: string
  isDirector: boolean
  lang?: string
}

export function getVisibleTranslators(translators: Translator[]): Translator[] {
  const ukrainianTranslators = translators.filter(translator => translator.lang === 'uk')
  if (ukrainianTranslators.length > 0) return ukrainianTranslators
  return translators.length === 1 ? translators : []
}
