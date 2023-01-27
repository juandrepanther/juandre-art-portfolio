import { Float, Html, Image, Text } from '@react-three/drei'
import React from 'react'
import wsadImg from '../../assets/images/wsad.png'
import arrowsKeysImg from '../../assets/images/arrowsKeys.png'

function Maze_Title() {
  return (
    <>
      <group position={[-0.37, 0.6, -10.2]}>
        <Float>
          <Text scale={0.2}>End of the Game</Text>
        </Float>
      </group>
      <group position={[0, 0.6, 0.7]}>
        <Float>
          <Text scale={0.2}>Dark Maze</Text>
        </Float>
      </group>
      <Text
        rotation={[Math.PI / -2, 0, 0]}
        position={[0, 0.1, 0.7]}
        scale={0.05}
      >
        R - reset the game
      </Text>
      <Image
        rotation={[Math.PI / -2, 0, 0]}
        position={[-0.2, 0, 0.38]}
        scale={[0.3, 0.2]}
        url={wsadImg}
        transparent
        opacity={0.8}
      ></Image>
      <Image
        rotation={[Math.PI / -2, 0, 0]}
        position={[0.2, 0, 0.38]}
        scale={[0.3, 0.2]}
        url={arrowsKeysImg}
        transparent
        opacity={0.8}
      ></Image>
    </>
  )
}

export default Maze_Title
