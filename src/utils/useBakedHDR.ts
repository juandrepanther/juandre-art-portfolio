import * as THREE from 'three'

//@Baked maps are applied using emissiveMap property.
//in this case you do not need use lights for model - just for characters need lights

const useBakedHDR = (
  model: any,
  meshName: string,
  bakedHDR: any,
  color?: any
) => {
  return model.traverse((parent: any) => {
    parent.material = new THREE.MeshLambertMaterial({
      // map: bakedHDR
      color: color ? color : new THREE.Color('#A8AAAA'),
      emissiveMap: !color && bakedHDR,
      emissive: !color && 'white',
      emissiveIntensity: !color && 1,
      //if want to see Intersector, turn of Building visibility
      visible: true,
      opacity: 0
      // roughness: 0.2,
      // metalness: 0.5,
      // color: 'gold'
    })
  })
}

export default useBakedHDR
