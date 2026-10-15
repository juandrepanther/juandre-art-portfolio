import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface IThemeStore {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

export const useThemeStore = create<IThemeStore>()(
  persist(
    (set) => ({
      isDarkMode: true,
      toggleDarkMode: () => {
        set((state) => ({ isDarkMode: !state.isDarkMode }))
      }
    }),
    {
      name: 'juandre-theme',
      storage: createJSONStorage(() => localStorage)
    }
  )
)
