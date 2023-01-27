import { Drawer } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSideBar_status } from '../../redux/reducers/sideBarReducer'
import CloseIcon from '@mui/icons-material/Close'
import CameraTrigger from './CameraTrigger'

//DATA IMPORTS

import ContentData from './../../data/ContentData'
import { selectID } from '../../redux/selectors/useSelectors'
import { useNavigate } from 'react-router-dom'

interface ISideBar {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}

function SideBar({ isOpen }: ISideBar) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [next_Id, setNextId] = useState<number>(0)
  const [isParent_Label, setIsParent_Label] = useState(false)
  const currentId = useSelector(selectID)

  useEffect(() => {
    //getting right data by selected id
    const selectedData = isParent_Label
      ? ContentData.filter((data) => data.id === next_Id)
      : ContentData.map((parentData) =>
          parentData.subTriggers?.length
            ? parentData.subTriggers.filter((subData) => subData.id === next_Id)
            : []
        ).filter((array) => array.length !== 0)[0]

    //sending data to redux
    if (selectedData) {
      CameraTrigger(selectedData[0], dispatch)
    }
  }, [next_Id, isParent_Label])

  //changing useState values by selected id

  const changeRoomOrLabelByID = (
    selectedId: number,
    isParentLabel: boolean
  ) => {
    if (selectedId === 2) {
      return window.open('https://janisdregeris.com/', '_blank', 'noreferrer')
    }
    if (selectedId === 4) {
      return navigate('/juandre-art-portfolio/maze-game/')
    } else {
      setNextId(selectedId)
      if (isParentLabel) {
        setIsParent_Label(true)
      } else {
        setIsParent_Label(false)
      }
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
          onClick={(e) => dispatch(setSideBar_status(false))}
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
                  onClick={() => changeRoomOrLabelByID(parentObject.id, true)}
                >
                  {parentObject.id === 1 && 'Curriculum vitae'}
                  {parentObject.id === 2 && 'Music Portfolio'}
                  {parentObject.id === 3 && 'Contacts'}
                  {parentObject.id >= 4 && 'Dark Maze Game'}
                </div>
                {parentObject.subTriggers && (
                  <>
                    {parentObject.subTriggers.map((subObject) => {
                      return (
                        <div
                          onClick={() =>
                            changeRoomOrLabelByID(subObject.id, false)
                          }
                          // className="menu-list-items"
                          className={
                            currentId === subObject.id
                              ? 'menu-list-items-selected'
                              : 'menu-list-items'
                          }
                          key={subObject.id}
                        >
                          {subObject.id}
                          <p>&nbsp;{subObject.subLabelTooltipTitle}</p>
                        </div>
                      )
                    })}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </Drawer>
  )
}

export default SideBar
