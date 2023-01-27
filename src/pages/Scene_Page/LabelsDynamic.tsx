import { useFrame } from '@react-three/fiber'
import React from 'react'
import ContentData from '../../data/ContentData'
import * as THREE from 'three'
import { useSelector } from 'react-redux'
import { selectID } from '../../redux/selectors/useSelectors'

function LabelsDynamic({ allIntersectionMeshes }) {
  //@MODEL VALIDATION STATEMENTS FOR BUILDING and LABELS FUNCTIONALITY

  const id = useSelector(selectID)

  const labelsDOMelements = []
  const subLabelsDOMelements = []
  const allParentLabelsDIVElements = document.querySelectorAll('.parent-label')
  const allSubLabelsDIVelements = document.querySelectorAll('.sub-label')

  //@LABELS: Getting dynamically all labels div`s elements for further transformation

  ContentData.map((parentObject) => {
    const parentLabelDOMelement = document.querySelector(
      `.point-${parentObject.id}`
    )
    labelsDOMelements.push(parentLabelDOMelement)

    if ('subTriggers' in parentObject) {
      parentObject.subTriggers.map((subObject) => {
        const subLabelDOMelement = document.querySelector(
          `.point-${subObject.id.toString().replace('.', '-')}`
        )
        subLabelsDOMelements.push(subLabelDOMelement)
      })
    }
  })

  //@CONDITIONAL RENDER OF LABELS

  for (const point of ContentData) {
    if (id === 0) {
      //@START - Building Mode
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
    } else if (id % 1) {
      //@AFTER CLICKING THE SUBLABEL (number with the decimal)
      useFrame(() => {
        allParentLabelsDIVElements.forEach((el) => {
          el.classList.add('hideLabels')
          el.classList.remove('visible')
        })
        allSubLabelsDIVelements.forEach((el) => {
          el.classList.add('hideLabels')
          el.classList.remove('visible')
        })
      })
    } else {
      //@ROOM VIEW
      useFrame((state) => {
        if (point.subTriggers) {
          for (const [index, subPoint] of point.subTriggers.entries()) {
            const subPointFromAxes = new THREE.Vector3(
              subPoint.position[0],
              subPoint.position[1],
              subPoint.position[2]
            )
            const screenPositionSubLabels = subPointFromAxes.clone()

            //Converting 3D coordinates to 2D normalized coordinates using method "project"
            screenPositionSubLabels.project(state.camera)

            //moving Label using this coordinates converted as pixels
            const translateX =
              screenPositionSubLabels.x * window.innerWidth * 0.5
            const translateY =
              -screenPositionSubLabels.y * window.innerHeight * 0.5

            const subLabel: HTMLElement = document.querySelector(
              `.point-${point.id}-${index + 1}`
            )

            subLabel.style.transform = `translate(${translateX}px, ${translateY}px)`
          }
        }
        //@logic when we are in the Room view and redux has a Room ID number
        //all parent Labels become hidden

        allParentLabelsDIVElements.forEach((el) =>
          el.classList.add('hideLabels')
        )

        if (point.subTriggers?.length && point.id === id) {
          point.subTriggers.map((roomLabel) => {
            const roomLabelDOM = document.querySelector(
              `.point-${roomLabel.id.toString().replace('.', '-')}`
            )
            roomLabelDOM.classList.add('visible')
            roomLabelDOM.classList.remove('hideLabels')
          })
        }
        //@HERE previous room sublabels are becoming hidden, when switching to another room
        //@and subLabels are becoming hidden after clicking on them
        if (point.subTriggers?.length && point.id !== id) {
          point.subTriggers.map((roomLabel) => {
            const roomLabelDOM = document.querySelector(
              `.point-${roomLabel.id.toString().replace('.', '-')}`
            )
            roomLabelDOM.classList.remove('visible')
            roomLabelDOM.classList.add('hideLabels')
          })
        }
      })
    }
  }

  return null
}

export default LabelsDynamic
