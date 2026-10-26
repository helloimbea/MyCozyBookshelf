// O tema inicial é aplicado por um script no index.html (antes do React carregar),
// para a página não piscar clara antes de ficar escura.
export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'mcb:theme'

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // sem armazenamento (ex.: navegação privada): o tema vale só até recarregar
  }
}
