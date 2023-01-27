import { Fab } from '@mui/material'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ContentData from '../../data/ContentData'
import CameraTrigger from './CameraTrigger'

/*Here are just JSX of Labels and subLabels. Logic for their
visibility and moving are in LabelsDynamic.tsx in MAIN UPDATE FRAME FUNCTION

CameraTrigger.ts is in use here for listening camera positions from labels and
sublabels positions.
*/

function LabelsHTML() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const selectRoomByNumber = (
    labelIdNumber: number,
    e: any,
    isSubLabel: boolean
  ) => {
    if (labelIdNumber === 1 || labelIdNumber === 3) {
      e.stopPropagation()
      if (isSubLabel) {
        ContentData.map((labelData) => {
          if (labelData.subTriggers) {
            const exactData = labelData.subTriggers.find(
              (subLabel) => subLabel.id === labelIdNumber
            )
            exactData && CameraTrigger(exactData, dispatch)
          }
        })
      } else {
        const contentDataByLabelIdNumber = ContentData.filter(
          (dataObject) => dataObject.id === labelIdNumber
        )

        CameraTrigger(contentDataByLabelIdNumber[0], dispatch)
      }
    } else if (labelIdNumber === 2) {
      return window.open('https://janisdregeris.com/', '_blank', 'noreferrer')
    } else if (labelIdNumber === 4) {
      return navigate('/juandre-art-portfolio/maze-game/')
    }
  }

  return (
    <div className="labels-container">
      {ContentData &&
        ContentData.map((label) => {
          return (
            <div key={label.id}>
              <div
                onClick={(e) => selectRoomByNumber(label.id, e, false)}
                className={`point point-${label.id} parent-label`}
              >
                <Fab className="label">{label.id}</Fab>
                {label.labelTooltipTitle && (
                  <p className="text">{label.labelTooltipTitle}</p>
                )}
              </div>
              {label.subTriggers && (
                <div className="subLabels-container">
                  {label.subTriggers.map((subLabel) => {
                    return (
                      <div
                        key={subLabel.id}
                        onClick={(e) =>
                          selectRoomByNumber(subLabel.id, e, true)
                        }
                        className={`point point-${subLabel.id
                          .toString()
                          .replace('.', '-')} sub-label hideLabels`}
                      >
                        <Fab className="label">{subLabel.id}</Fab>
                        {subLabel.subLabelTooltipTitle && (
                          <p className="text">
                            {subLabel.subLabelTooltipTitle}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
    </div>
  )
}
export default LabelsHTML
