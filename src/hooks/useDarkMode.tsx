import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setDarkMode } from '../redux/reducers/darkModeReducer'

export type DarkModeClassType = 'light-mode' | 'dark-mode' | 'on-page-load'
export type SetIsDarkModeType = boolean | null
export type SetIconColorType = 'white' | 'black'

function useDarkMode(): [
  DarkModeClassType,
  SetIsDarkModeType,
  () => void,
  SetIconColorType
] {
  const dispatch = useDispatch()
  const [darkModeClass, setDarkModeClass] =
    useState<DarkModeClassType>('on-page-load')
  const [isDarkMode, setIsDarkMode] = useState<SetIsDarkModeType>(null)
  const [iconColor, setIconColor] = useState<SetIconColorType>('black')

  const setDarkModeHandler = () => {
    setIsDarkMode(!isDarkMode)
    dispatch(setDarkMode())
  }

  useEffect(() => {
    if (isDarkMode) {
      setDarkModeClass('dark-mode')
      setIconColor('white')
    } else if (darkModeClass !== 'on-page-load') {
      setDarkModeClass('light-mode')
      setIconColor('black')
    }
  }, [isDarkMode])

  return [darkModeClass, isDarkMode, setDarkModeHandler, iconColor]
}

export default useDarkMode
