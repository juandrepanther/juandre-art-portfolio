import { Box } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { selectID } from '../../../../redux/selectors/useSelectors'

function ShowFloor() {
  const id = useSelector(selectID)
  return (
    id !== 0 && (
      <Box sx={{ display: { xs: 'none', sm: 'none', md: 'initial' } }}>{`${id
        .toString()
        .match(/[^.]*/)}. Floor`}</Box>
    )
  )
}

export default ShowFloor
