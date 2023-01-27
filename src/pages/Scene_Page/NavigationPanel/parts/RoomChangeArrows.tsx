import { Fab, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectID } from '../../../../redux/selectors/useSelectors'

import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ContentData from '../../../../data/ContentData'
import CameraTrigger from '../../CameraTrigger'
import ShowFloor from './ShowFloor'

function RoomChangeArrows() {
  const id: number = useSelector(selectID)
  const id_wholeNumber = Math.floor(id)
  const dispatch = useDispatch()
  const [nextId, setNextId] = useState<number>(id)
  const contentDataLength = useMemo(() => ContentData.length, [])

  const changeRoomHandler = (direction: string) => {
    if (direction === 'next') {
      if (nextId < contentDataLength) {
        setNextId((prevState) => Math.trunc(prevState + 1))
      }
    }
    if (direction === 'previous') {
      if (nextId > 1) setNextId((prevState) => Math.trunc(prevState - 1))
      if (nextId === 1) return
    }
  }

  //@ LISTENER for ROOM CHANGE

  const nextPulsarData = useMemo(
    () => ContentData.filter((data) => data.id === nextId),
    [nextId]
  )
  useEffect(() => {
    if (nextPulsarData && Number.isInteger(nextId)) {
      CameraTrigger(nextPulsarData[0], dispatch)
    }
  }, [nextId])

  return (
    <>
      <Tooltip title="Previous Spot" placement="top">
        <Fab
          size="small"
          disabled={id_wholeNumber === 5 ? true : false}
          onClick={() => changeRoomHandler('next')}
        >
          <NavigateBeforeIcon style={{ color: 'black' }} />
        </Fab>
      </Tooltip>
      <Typography
        component={'span'}
        sx={{
          userSelect: 'none',
          margin: { xs: '0 .5rem', sm: '0 .5rem', md: '0 2rem' },
          fontWeight: 700
        }}
      >
        <ShowFloor />
      </Typography>
      <Tooltip title="Next Spot" placement="top">
        <Fab
          size="small"
          disabled={id_wholeNumber === 1 ? true : false}
          onClick={() => changeRoomHandler('previous')}
        >
          <NavigateNextIcon style={{ color: 'black' }} />
        </Fab>
      </Tooltip>
    </>
  )
}

export default RoomChangeArrows
