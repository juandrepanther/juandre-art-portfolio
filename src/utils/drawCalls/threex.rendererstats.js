import './rendererStats.css'

var THREEx = THREEx || {}

const firstLevel = 35
const secondLevel = 50

THREEx.RendererStats = function () {
  var container = document.createElement('div')
  container.style.cssText = 'width:80px;opacity:0.9'
  container.setAttribute('class', `parametersContainer`)

  var msDiv = document.createElement('div')
  msDiv.setAttribute('class', `parametersWrapper`)

  msDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;'

  container.appendChild(msDiv)

  var msText = document.createElement('div')
  // msText.style.cssText =
  //   'color:#f00;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px'
  // msText.innerHTML = 'WebGLRenderer'
  msText.setAttribute('class', `parameterBox`)
  msDiv.appendChild(msText)

  var msTexts = []
  var nLines = 9
  for (var i = 0; i < nLines; i++) {
    msTexts[i] = document.createElement('div')
    msTexts[i].setAttribute('id', `line parameter-${i}`)
    msTexts[i].setAttribute('class', `parameter-${i}`)
    // msTexts[i].classList.add(`parameter-${i}`)
    msTexts[i].style.cssText =
      'font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px'
    msDiv.appendChild(msTexts[i])
    // msTexts[i].innerHTML = '-'
  }

  var lastTime = Date.now()

  return {
    domElement: container,

    update: function (webGLRenderer) {
      // console.log(webGLRenderer)
      // sanity check
      // console.assert(webGLRenderer instanceof THREE.WebGLRenderer)

      // refresh only 30time per second
      if (Date.now() - lastTime < 1000 / 30) return
      lastTime = Date.now()

      var i = 0
      msTexts[i++].textContent = '== Memory ====='
      msTexts[i++].textContent =
        'Programs: ' + webGLRenderer.info.programs.length
      msTexts[i++].textContent =
        'Geometries: ' + webGLRenderer.info.memory.geometries
      msTexts[i++].textContent =
        'Textures: ' + webGLRenderer.info.memory.textures

      msTexts[i++].textContent = '== Render ====='

      //DrawCalls dom class name is "parameter-5"
      msTexts[i++].textContent =
        'Draw Calls: ' + webGLRenderer.info.render.calls
      //@DYNAMIC STYLES FOR DRAW CALL REPRESENTATION

      if (webGLRenderer.info.render.calls < firstLevel) {
        msTexts[5].classList.remove('manyDrawCalls')
        msTexts[5].classList.remove('tooManyDrawCalls')
        msTexts[5].classList.add('normalDrawCalls')
      }

      if (
        webGLRenderer.info.render.calls > firstLevel &&
        webGLRenderer.info.render.calls < 50
      ) {
        msTexts[5].classList.remove('normalDrawCalls')
        msTexts[5].classList.remove('tooManyDrawCalls')
        msTexts[5].classList.add('manyDrawCalls')
      }

      if (webGLRenderer.info.render.calls > secondLevel) {
        msTexts[5].classList.remove('normalDrawCalls')
        msTexts[5].classList.remove('manyDrawCalls')
        msTexts[5].classList.add('tooManyDrawCalls')
      }

      msTexts[i++].textContent =
        'Triangles: ' + webGLRenderer.info.render.triangles

      // msTexts[i++].textContent = 'Faces: ' + webGLRenderer.info.render.faces
      msTexts[i++].textContent = 'Points: ' + webGLRenderer.info.render.points
    }
  }
}

export default THREEx
