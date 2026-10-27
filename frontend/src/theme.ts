// The initial theme is applied by a script in index.html (before React loads),
// so the page doesn't flash light before turning dark.
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
    // no storage (e.g. private mode): the theme lasts until the page reloads
  }
}
