import React, { useEffect, useState } from 'react'
import { Drawer } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setSideBar_status } from '../../redux/reducers/sideBarReducer'
import CloseIcon from '@mui/icons-material/Close'
import CameraTrigger from './CameraTrigger'
import ContentData from './../../data/ContentData'
import { selectID } from '../../redux/selectors/useSelectors'
import { useNavigate } from 'react-router-dom'

interface ISideBar {
  isOpen: boolean
  setIsOpen: () => void
}

function SideBar({ isOpen }: ISideBar) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [next_Id, setNextId] = useState<number>(0)
  const currentId = useSelector(selectID)

  useEffect(() => {
    if (next_Id > 0) {
      const selectedData = ContentData.filter((data) => data.id === next_Id)
      CameraTrigger(selectedData[0], dispatch)
    }
  }, [next_Id])

  const changeRoomOrLabelByID = (selectedId: number) => {
    if (selectedId === 3) {
      return navigate('/maze-game/')
    } else {
      setNextId(selectedId)
    }
  }

  return (
    <Drawer
      className="menu-container"
      PaperProps={{
        sx: {
          width: { xs: '30rem', sm: '30rem', md: '30rem' },
          background: '#ffffff86',
          backdropFilter: 'blur(10px)'
        }
      }}
      variant="permanent"
      anchor="right"
      open={isOpen}
      onClose={() => dispatch(setSideBar_status())}
    >
      <div className="menu-close-wrapper">
        <div
          onClick={() => dispatch(setSideBar_status(false))}
          className="menu-close-icon"
        >
          <CloseIcon />
        </div>
        <div className="menu-list">
          {ContentData.map((parentObject, index) => {
            return (
              <div className="menu-list-items-wrapper" key={index}>
                <div
                  className={
                    currentId === parentObject.id
                      ? 'menu-list-selected'
                      : 'menu-list-headers'
                  }
                  key={Math.random()}
                  onClick={() => changeRoomOrLabelByID(parentObject.id)}
                >
                  {parentObject.id === 1 && 'Curriculum vitae'}
                  {parentObject.id === 2 && 'Contacts'}
                  {parentObject.id === 3 && 'Dark Maze Game'}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Drawer>
  )
}

export default SideBar
