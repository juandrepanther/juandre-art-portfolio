import React from 'react'
import ContentData from '../../data/ContentData'
import CameraTrigger from './CameraTrigger'
import { Fab } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function LabelsHTML() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const selectRoomByNumber = (labelIdNumber: number) => {
    if (labelIdNumber === 3) {
      navigate('/maze-game/')
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
