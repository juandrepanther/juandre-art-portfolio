import { create } from 'zustand'

interface IMazeStore {
  isMobileHintClosed: boolean
  closeMobileHint: () => void
}

export const useMazeStore = create<IMazeStore>()((set) => ({
  isMobileHintClosed: false,
  closeMobileHint: () => {
    set({ isMobileHintClosed: true })
  }
}))
