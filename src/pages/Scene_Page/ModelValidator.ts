import { IModelValidator } from '../../types'

//TEXT VARIABLES

const warningTextRooms =
  'Probably this could be a reason why baked map is not applied!'

const warningText2 =
  'Check if file exists, right file format and if correct file naming!'

const remarkText =
  'Note: When Materials are NOT exported in the Blender, Group becomes as Mesh. In this case Room parent would be a Mesh. If Materials ARE exported - Room parent is a Group and probably baked map could NOT be applied.'

function ModelValidator({
  isNotBuildingMesh = false,
  currentBuildingType,
  isRoom01 = true,
  isRoom02 = true,
  isRoom03 = true,
  isRoom04 = true,
  isRoom05 = true,
  isBuildingModel = true,
  isVoid = true,
  isBuilding = true,
  BakedRoom01 = true,
  BakedRoom02 = true,
  BakedRoom03 = true,
  BakedRoom04 = true,
  BakedRoom05 = true,
  BakedBuilding = true,
  BakedVOID = true,
  isGltf = false,
  scene = false
}: IModelValidator) {
  //@MESSAGES for CONSOLE

  isGltf && console.log(`Tower Model Rendered Successfully. Data:`, isGltf)
  scene && console.log(`Characters Rendered Successfully. Data:`, scene)

  // !isBuildingModel &&
  //   console.warn(
  //     'There is %cNO Mesh with name "Building"%c.',
  //     'color:red; font-size: 1.1rem'
  //   )

  !isRoom01 &&
    console.warn(
      `%cNo Mesh%c with name "Room01". ${warningTextRooms} ${remarkText}`,
      'color: red'
    )
  !isRoom02 &&
    console.warn(
      `%cNo Mesh%c with name "Room02". ${warningTextRooms} ${remarkText}`,
      'color: red'
    )
  !isRoom03 &&
    console.warn(
      `%cNo Mesh%c with name "Room03". ${warningTextRooms} ${remarkText}`,
      'color: red'
    )
  !isRoom04 &&
    console.warn(
      `%cNo Mesh%c with name "Room04". ${warningTextRooms} ${remarkText}`,
      'color: red'
    )
  !isRoom05 &&
    console.warn(
      `%cNo Mesh%c with name "Room05". ${warningTextRooms} ${remarkText}`,
      'color: red'
    )
  !isVoid &&
    console.warn(
      `%cNo Mesh%c with name "VOID". ${warningTextRooms} ${remarkText}`,
      'color: red'
    )
  !isBuilding &&
    console.warn(
      `%cNo Mesh%c with name "Building". ${warningTextRooms} ${remarkText} Building model part should be the Mesh. Please check if naming of meshes is correct, also check if Building is NOT a Group! In this case baked map for Building CAN NOT be applied.`,
      'color: red'
    )

  !BakedRoom01.source.data &&
    console.error(`Can NOT load baked map for Room01! ${warningText2}`)
  !BakedRoom02.source.data &&
    console.error(`Can NOT load baked map for Room02! ${warningText2}`)
  !BakedRoom03.source.data &&
    console.error(`Can NOT load baked map for Room03! ${warningText2}`)
  !BakedRoom04.source.data &&
    console.error(`Can NOT load baked map for Room04! ${warningText2}`)
  !BakedRoom05.source.data &&
    console.error(`Can NOT load baked map for Room05! ${warningText2}`)
  !BakedVOID.source.data &&
    console.error(`Can NOT load baked map for VOID! ${warningText2}`)
  !BakedBuilding.source.data &&
    console.error(`Can NOT load baked map for Building! ${warningText2}`)
  return null
}

export default ModelValidator
