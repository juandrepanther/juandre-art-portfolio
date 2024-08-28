import { useFrame } from '@react-three/fiber'
import ContentData from '../../data/ContentData'
import * as THREE from 'three'
import { useSelector } from 'react-redux'
import { selectID } from '../../redux/selectors/useSelectors'

function LabelsDynamic({ allIntersectionMeshes }) {
  //MODEL VALIDATION STATEMENTS FOR BUILDING and LABELS FUNCTIONALITY

  const id = useSelector(selectID)

  const labelsDOMelements = []
  const allParentLabelsDIVElements = document.querySelectorAll('.parent-label')
  const allSubLabelsDIVelements = document.querySelectorAll('.sub-label')

  //LABELS: Getting dynamically all labels div`s elements for further transformation

  ContentData.map((parentObject) => {
    const parentLabelDOMelement = document.querySelector(
      `.point-${parentObject.id}`
    )
    labelsDOMelements.push(parentLabelDOMelement)
  })

  for (const point of ContentData) {
    if (id === 0) {
      //START - Building Mode
      useFrame((state) => {
        const pointFromAxes = new THREE.Vector3(
          point.position[0],
          point.position[1],
          point.position[2]
        )
        const screenPosition = pointFromAxes.clone()

        //Converting 3D coordinates to 2D normalized coordinates using method "project"
        screenPosition.project(state.camera)

        //moving Label using this coordinates converted as pixels
        const translateX = screenPosition.x * window.innerWidth * 0.5
        const translateY = -screenPosition.y * window.innerHeight * 0.5

        const parentLabel: HTMLElement = document.querySelector(
          `.point-${point.id}`
        )

        parentLabel.style.transform = `translate(${translateX}px, ${translateY}px)`

        //Raycasting

        state.raycaster.setFromCamera(screenPosition, state.camera)

        const intersects = state.raycaster.intersectObjects(
          allIntersectionMeshes,
          false
        )

        if (intersects.length > 0) {
          const fromCameraToBuildingDistance = intersects[0].distance
          const fromCameraToPointDistance = pointFromAxes.distanceTo(
            state.camera.position
          )

          if (fromCameraToPointDistance < fromCameraToBuildingDistance) {
            labelsDOMelements[point.id - 1].classList.add('visible')
          } else {
            labelsDOMelements[point.id - 1].classList.remove('visible')
          }
        } else {
          labelsDOMelements[point.id - 1].classList.add('visible')
        }
        allParentLabelsDIVElements.forEach((el) =>
          el.classList.remove('hideLabels')
        )
        allSubLabelsDIVelements.forEach((el) => {
          el.classList.add('hideLabels')
          el.classList.remove('visible')
        })
      })
    } else {
      useFrame(() => {
        allParentLabelsDIVElements.forEach((el) =>
          el.classList.add('hideLabels')
        )
      })
    }
  }

  return null
}

export default LabelsDynamic
