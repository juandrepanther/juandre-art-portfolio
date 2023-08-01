import { Fab } from '@mui/material'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ContentData from '../../data/ContentData'
import CameraTrigger from './CameraTrigger'

function LabelsHTML() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const selectRoomByNumber = (labelIdNumber: number) => {
    if (labelIdNumber === 3) {
      return navigate('/maze-game/')
    } else {
      const contentDataByLabelIdNumber = ContentData.filter(
        (dataObject) => dataObject.id === labelIdNumber
      )

      CameraTrigger(contentDataByLabelIdNumber[0], dispatch)
    }
  }

  return (
    <div className="labels-container">
      {ContentData &&
        ContentData.map((label) => {
          return (
            <div key={label.id}>
              <div
                onClick={() => selectRoomByNumber(label.id)}
                className={`point point-${label.id} parent-label`}
              >
                <Fab className="label">{label.id}</Fab>
                {label.labelTooltipTitle && (
                  <p className="text">{label.labelTooltipTitle}</p>
                )}
              </div>
            </div>
          )
        })}
    </div>
  )
}
export default LabelsHTML
