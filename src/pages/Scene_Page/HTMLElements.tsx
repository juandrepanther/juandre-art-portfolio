import React, { lazy, Suspense, useEffect, useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import CropSquareIcon from '@mui/icons-material/CropSquare'
import LaptopIcon from '@mui/icons-material/Laptop'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useDispatch, useSelector } from 'react-redux'
import { setSideBar_status } from '../../redux/reducers/sideBarReducer'
import {
  selectCameraType,
  selectID,
  selectIsInitialPopupVisible,
  selectIsLogoTopIconsVisible,
  selectSideBar_status
} from '../../redux/selectors/useSelectors'
import { setLockedCameraStartPos } from '../../redux/reducers/lockedCameraStartPos'
import { lockedCamera_startPosition } from '../../data/ContentData'
import { setFocus } from '../../redux/reducers/focusReducer'
import { setCamera } from '../../redux/reducers/cameraReducer'
import { setZoom } from '../../redux/reducers/zoomReducer'
import { resetCurrentPulsar } from '../../redux/reducers/currentPulsarReducer'
import { Box, Modal, Switch, Tooltip } from '@mui/material'
import { changeInitialPopupVisibility } from '../../redux/reducers/initialPopupReducer'
import InitialPopUp from './InitialPopUp'
import { displayFlexCenter } from '../../utils/globalStyles'
import Container from '@mui/material/Container'
const CV_Page = lazy(() => import('../CV_Page/CV_Page'))
const Contact_Page = lazy(() => import('../Contact_Page/Contact_Page'))
import CloseIcon from '@mui/icons-material/Close'
const LazySideBar = lazy(() => import('./SideBar'))
import useDarkMode from '../../hooks/useDarkMode'
import { useNavigate } from 'react-router-dom'

function HTMLElements() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const label = { inputProps: { 'aria-label': 'Switch demo' } }
  const cameraType = useSelector(selectCameraType)
  const isInitialPopupVisible = useSelector(selectIsInitialPopupVisible)
  const sideBar_status = useSelector(selectSideBar_status)
  const logoTopIcons_status = useSelector(selectIsLogoTopIconsVisible)
  const id = useSelector(selectID)

  const openSideBarHandler = (e: any) => {
    e.stopPropagation()
    dispatch(setSideBar_status(true))
  }

  //@ CLOSE MODAL
  const freeCameraMode = (e: any) => {
    dispatch(
      setLockedCameraStartPos({
        x: lockedCamera_startPosition[0],
        y: lockedCamera_startPosition[1],
        z: lockedCamera_startPosition[2]
      })
    )
    dispatch(
      setFocus({
        x: lockedCamera_startPosition[0],
        y: lockedCamera_startPosition[1],
        z: lockedCamera_startPosition[2]
      })
    )
    e.stopPropagation(), dispatch(setSideBar_status(false))
    dispatch(setCamera({ cameraType: 'free' }))
    dispatch(setZoom(false))
    dispatch(resetCurrentPulsar())
  }

  //@SHOW INITIAL POP UP FUNCTION

  const showInitialPopUp = () => dispatch(changeInitialPopupVisibility(true))

  //@DARK MODE SETUP

  const [darkModeClass, isDarkMode, setDarkModeHandler, iconColor] =
    useDarkMode()

  return (
    <>
      <div className={`overlay ${darkModeClass}`}></div>
      {isInitialPopupVisible && <InitialPopUp />}
      {id > 0 && id < 3 && (
        <Modal
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          open={true}
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              ...displayFlexCenter
            }}
          >
            <Box
              className="modal-close-icon"
              onClick={freeCameraMode}
              sx={{
                position: 'absolute',
                zIndex: 9,
                right: '10%',
                top: '1.2rem',
                cursor: 'pointer'
              }}
            >
              <CloseIcon
                stroke={'black'}
                strokeWidth={0.2}
                sx={{ color: 'white', fontSize: '4rem' }}
              />
            </Box>
            <Container
              sx={{
                overflow: 'auto',
                position: 'relative',
                height: '90%',
                backgroundColor: 'white',
                borderRadius: '1rem'
              }}
              disableGutters
              maxWidth="lg"
            >
              <Suspense fallback={null}>
                {id === 1 && <CV_Page />}
                {id === 2 && <Contact_Page />}
              </Suspense>
            </Container>
          </Box>
        </Modal>
      )}
      {cameraType === 'free' && logoTopIcons_status && (
        <div className="left-top-accLogo-freeCameraBtn">
          <LaptopIcon sx={{ color: iconColor }} />
        </div>
      )}

      {!isInitialPopupVisible && sideBar_status ? (
        <Suspense fallback={<div>Loading...</div>}>
          <LazySideBar
            isOpen={sideBar_status}
            setIsOpen={() => dispatch(setSideBar_status())}
          />
        </Suspense>
      ) : (
        <>
          {!isInitialPopupVisible && logoTopIcons_status && (
            <>
              <div onClick={openSideBarHandler} className="menu-icon">
                <MenuIcon sx={{ color: iconColor }} />
              </div>
              <Box className="dark-mode-switch">
                <Switch
                  color="default"
                  checked={isDarkMode}
                  onChange={() => setDarkModeHandler()}
                  {...label}
                />
              </Box>
              <div className="help-btn">
                <Tooltip title="Go to start" placement="top">
                  <Box
                    sx={{
                      '&:hover': {
                        cursor: 'help'
                      }
                    }}
                    onClick={showInitialPopUp}
                  >
                    <CropSquareIcon sx={{ color: iconColor }} />
                  </Box>
                </Tooltip>
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}

export default HTMLElements
