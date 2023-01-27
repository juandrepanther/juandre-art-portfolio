import React, { useEffect } from 'react'
import { useControls } from 'leva'
import { useDispatch } from 'react-redux'
import { setDebuggerStates } from '../../redux/reducers/debuggerReducer'

function HTMLDebugger() {
  const dispatch = useDispatch()

  const { position, flipHalf } = useControls('Helper Ball', {
    position: {
      value: { x: -3.42, y: 2.66, z: 1 },
      step: 0.01,
      min: -9,
      max: 9
    },
    flipHalf: false
  })

  const { Rooms, Building, Intersection, Void, Characters } = useControls(
    'Wireframes',
    {
      Rooms: false,
      Building: false,
      Intersection: false,
      Void: false,
      Characters: false
    }
  )

  const { Monitoring } = useControls({ Monitoring: false })

  useEffect(() => {
    dispatch(
      setDebuggerStates({
        x: position.x,
        y: position.y,
        z: position.z,
        isWireframeRooms: Rooms,
        isWireframeBuilding: Building,
        isWireframeIntersection: Intersection,
        isWireframeVoid: Void,
        isWireframeCharacters: Characters,
        helperBallrotate: flipHalf,
        isMonitoring: Monitoring
      })
    )
  }, [
    position,
    Rooms,
    Building,
    Intersection,
    Void,
    Characters,
    flipHalf,
    Monitoring
  ])

  //!check and remove DrawCalls and FPS meter
  if (!Monitoring) {
    const drawCallsMeterDivElements = document.querySelector(
      '.parametersContainer'
    )

    drawCallsMeterDivElements && drawCallsMeterDivElements.remove()
  }

  return <div></div>
}

export default HTMLDebugger
