const FAVORITES_KEY = "favorites"

export function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch (e) {
    console.error("Failed to load favorites from localStorage", e)
    return []
  }
}

export function saveFavorites(favorites) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  } catch (e) {
    console.error("Failed to save favorites to localStorage", e)
  }
}

export function clearFavorites() {
  try {
    localStorage.removeItem(FAVORITES_KEY)
  } catch (e) {
    console.error("Failed to clear favorites", e)
  }
}
