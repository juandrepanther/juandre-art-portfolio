import React from 'react'
import { Fab } from '@mui/material'
import { useDispatch } from 'react-redux'
import ContentData from '../../data/ContentData'
import CameraTrigger from './CameraTrigger'

function LabelsHTML() {
  const dispatch = useDispatch()

  const selectRoomByNumber = (labelIdNumber: number) => {
    if (labelIdNumber === 3) {
      window.open('/maze-game/', '_blank')
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
