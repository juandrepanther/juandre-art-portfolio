import { keyframes } from '@mui/material'

export const btnStyleGlobal = {
  mt: '2rem',
  borderColor: '#58A8B3',
  color: '#58A8B3',
  '&:hover': {
    borderColor: '#58A8B3'
  }
}

export const spin = keyframes`
from {
  transform: rotateY(0deg);
}
to {
  transform: rotateY(360deg);
}
`

// RESPONSIVE IMAGES

export const responsiveImg = {
  maxWidth: '100%',
  height: 'auto'
}

// HIDE & CHANGE FOR THE MOBILE

export const showOverflowOnMobile = {
  xs: 'visible',
  sm: 'initial',
  md: 'initial',
  lg: 'initial',
  xl: 'initial'
}

export const videoWidthForMobile = {
  xs: '20rem',
  sm: '35rem',
  md: '50rem',
  lg: '60rem',
  xl: '60rem'
}

export const hideOnMobileAbsolute = {
  xs: 'none',
  sm: 'none',
  md: 'initial',
  lg: 'initial',
  xl: 'initial'
}

export const hideOnMobileAbsolute2 = {
  xs: 'none',
  sm: 'none',
  md: 'none',
  lg: 'initial',
  xl: 'initial'
}

export const hideOnMobileFlex = {
  xs: 'none',
  sm: 'none',
  md: 'flex',
  lg: 'flex',
  xl: 'flex'
}

export const hideOnMobileFlex2 = {
  xs: 'none',
  sm: 'none',
  md: 'none',
  lg: 'flex',
  xl: 'flex'
}

export const hideOnMobileDisplay = {
  display: {
    xs: 'none',
    sm: 'none',
    md: 'initial',
    lg: 'initial',
    xl: 'initial'
  }
}

export const showOnMobileDisplay = {
  display: {
    xs: 'flex',
    sm: 'flex',
    md: 'none',
    lg: 'none',
    xl: 'none'
  },
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
}

export const hideOnMobileDisplay2 = {
  display: {
    xs: 'none',
    sm: 'none',
    md: 'initial',
    lg: 'initial',
    xl: 'initial'
  }
}

export const hideOnMobileDisplay3 = {
  display: {
    xs: 'none',
    sm: 'none',
    md: 'none',
    lg: 'initial',
    xl: 'initial'
  }
}

// CHANGE DIRECTION FOR THE MOBILE

export const fromRowToColumn = {
  xs: 'column',
  sm: 'column',
  md: 'column',
  lg: 'row',
  xl: 'row'
}

export const fromRowToColumn2 = {
  xs: 'column',
  sm: 'column',
  md: 'row',
  lg: 'row',
  xl: 'row'
}

// GRID

export const rowToColumnGridContainer = { xs: 4, sm: 4, md: 12, lg: 12, xl: 12 }
// grid items in this case should be xs={4} sm={4} md={6} lg={6} xl={6}

// CENTERING UTILS

export const displayFlexCenter = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

export const displayFlexCenterSpaceBetween = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}

export const displayFlexCenterColumnLeft = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
}

export const displayFlexCenterColumn = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
}

// MARGINS & PADDINGS & FONT UTILS

export const sidePaddings = {
  px: { xs: '1rem', sm: '1rem', md: '1rem', lg: '1rem', xl: '1rem' }
}

export const topMarginMobile = {
  xs: '1rem',
  sm: '1rem',
  md: 'inherit',
  lg: 'inherit',
  xl: 'inherit'
}

export const headerMobileWidth = {
  xs: '20rem',
  sm: '35rem',
  md: '40rem',
  lg: '40rem',
  xl: '40rem'
}

export const headerMobileCenter = {
  xs: 'center',
  sm: 'start',
  md: 'start',
  lg: 'start',
  xl: 'start'
}

export const smallerTextForMobile = {
  xs: '0.7rem',
  sm: 'inherit',
  md: 'inherit',
  lg: 'inherit',
  xl: 'inherit'
}

export const smallerTextForMobile3 = {
  xs: '0.7rem',
  sm: 'inherit',
  md: 'inherit',
  lg: 'inherit',
  xl: 'inherit'
}

export const absolutePositionForMobile1 = {
  xs: '0.7rem',
  sm: 'inherit',
  md: 'inherit',
  lg: 'inherit',
  xl: 'inherit'
}

export const absolutePositionForMobile2 = {
  xs: '0.7rem',
  sm: 'inherit',
  md: 'inherit',
  lg: 'inherit',
  xl: 'inherit'
}

export const smallerTextForMobile2 = {
  xs: '0.9rem',
  sm: '0.9rem',
  md: 'inherit',
  lg: 'inherit',
  xl: 'inherit'
}

export const topMarginMobileSmaller = {
  xs: '5rem',
  sm: '5rem',
  md: '6rem',
  lg: '6rem',
  xl: '6rem'
}

export const topMarginMobileSmaller2 = {
  xs: '2rem',
  sm: '2rem',
  md: '2rem',
  lg: '5rem',
  xl: '5rem'
}

export const bottomMarginMobileBigger = {
  xs: '9rem',
  sm: '9rem',
  md: '9rem',
  lg: '5rem',
  xl: '5rem'
}

export const bottomMarginMobileSmaller = {
  xs: '1rem',
  sm: '1rem',
  md: '3.5rem',
  lg: '3.5rem',
  xl: '3.5rem'
}

export const modalForMobile_width = {
  xs: '90%',
  sm: '90%',
  md: '90%',
  lg: '70%',
  xl: '70%'
}

export const forMobile_width2 = {
  xs: '100%',
  sm: '100%',
  md: '70%',
  lg: '70%',
  xl: '70%'
}
export const modalForMobile_height = {
  xs: '90%',
  sm: '90%',
  md: '80%',
  lg: '50%',
  xl: '40%'
}

// COLORS & SELECTIONS

export const noSelect = { userSelect: 'none' }

export const textSelection = {
  '&::selection': { backgroundColor: 'black', color: 'white' }
}

export const noDragImg = { pointerEvents: 'none' }
