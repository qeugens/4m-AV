import p5 from 'p5'
import { getRandomArbitrary } from './src/utilities.js'

import * as Tone from 'tone'
import * as lead from './src/lead.js'
import * as bass from './src/bass.js'
import * as solo from './src/solo.js'
// import * as sampler from './src/sampler.js'

// export const wsConnection = new WebSocket('ws://localhost:3000/websocket')

const laserSensorsData = [0, 10, 50, 50, 50, 10, 10]

let buttonEventListener

let canvasSize = {}
let cellSize

let webAudioStarted = false

// wsConnection.onopen = function () {
//   console.log('Соединение установлено.')
// }

// wsConnection.onclose = function (event) {
//   if (event.wasClean) {
//     console.log('Соединение закрыто чисто')
//   } else {
//     console.log('Обрыв соединения') // например, "убит" процесс сервера
//   }
//   console.log('Код: ' + event.code + ' причина: ' + event.reason)
// }

// wsConnection.onerror = function (error) {
//   console.log('Ошибка ' + error.message)
// }

// wsConnection.onmessage = function message(event) {
//   // console.log(event.data)
//   updateData(event.data)
// }

// export const wsSend = function (data) {
//   // readyState - true, если есть подключение
//   if (!wsConnection.readyState) {
//     setTimeout(function () {
//       wsSend(data);
//     }, 100);
//   } else {
//     wsConnection.send(data);
//   }
// };

function addStartButton() {
  const startButton = document.createElement('div')
  startButton.id = 'startButton'
  startButton.style.position = 'fixed'
  startButton.style.top = '10px'
  startButton.style.right = '10px'
  startButton.innerText = 'Start'

  buttonEventListener = startButton.addEventListener('click', () => {
    init()
  })

  document.body.appendChild(startButton)
}

function removeStartButton() {
  const button = document.getElementById('startButton')

  button.removeEventListener('click', () => {
    init()
  })

  button.remove()
}

function addCanvasContainer() {
  const container = document.body
  container.style.margin = 0

  const frame = document.createElement('div')
  frame.classList.add('frame')
  frame.id = 'frame'
  container.appendChild(frame)
}

function addDebugPanel() {
  const debugPanel = document.createElement('div')
  debugPanel.style.position = 'fixed'
  debugPanel.style.top = '10px'
  debugPanel.style.left = '10px'

  const debugLaser1 = document.createElement('div')
  const debugLaser2 = document.createElement('div')
  const debugLaser3 = document.createElement('div')
  const debugLaser4 = document.createElement('div')
  const debugLaser5 = document.createElement('div')
  const debugLaser6 = document.createElement('div')
  // const debugLaser7 = document.createElement('div')
  // const debugPhotoCell = document.createElement('div')

  const debugLasers = [
    debugLaser1,
    debugLaser2,
    debugLaser3,
    debugLaser4,
    debugLaser5,
    debugLaser6
    // debugLaser7,
    // debugPhotoCell
  ]

  debugLasers.forEach((element, i) => {
    element.style.color = 'white'
    element.id = `laser${i}`
    debugPanel.appendChild(element)
  })

  document.body.appendChild(debugPanel)
}

async function init() {
  removeStartButton()
  // const context = new Tone.Context()
  // context.resume()
  // await Tone.start()
  console.log('BEFORE TONE')
  Tone.Transport.bpm.value = 140
  Tone.Transport.start()

  lead.instrument[0].node.triggerAttackRelease('C5', '1n')

  webAudioStarted = true
  //
  // const instruments = [
  //   bass.instrument,
  //   lead.instrument,
  //   solo.instrument
  //   // sampler.instrument
  // ]

  // sampler.instrument[0].part.start(0)

  canvasSize = { width: window.innerWidth, height: window.innerHeight }

  let sketch = (p) => {
    p.setup = () => {
      let canvas = p.createCanvas(canvasSize.width, canvasSize.height)
      canvas.parent('frame')
      p.frameRate(24)
    }

    p.draw = () => {
      // const background = laserSensorsData[0]
      const background = 0

      const red = laserSensorsData[0]
      const green = laserSensorsData[1]
      const blue = laserSensorsData[2]

      const weight = laserSensorsData[3] / 3

      // console.log(laserSensorsData[4] / 3, parseInt(laserSensorsData[4] / 3))

      const gridSize = parseInt(laserSensorsData[4] / 3)
      // const gridSize = 10

      const cellSize = {
        width: canvasSize.width / gridSize,
        height: canvasSize.height / gridSize
      }

      // const amplitude = laserSensorsData[5] / 10
      const amplitude = laserSensorsData[5]
      // const curvature = laserSensorsData[6] / 10

      p.background(background)
      p.noFill()
      p.strokeWeight(weight)

      p.stroke(red, green, blue)

      for (var row = 0; row < gridSize; row++) {
        const top = row * cellSize.height

        for (var column = 0; column < gridSize + 1; column++) {
          // const left = (column + 1) * cellSize.width
          const left = column * cellSize.width

          if (column === 0) {
            p.beginShape()
            p.vertex(left, top)
          } else {
            // const entropy = getRandomArbitrary()
            // const shift = getRandomArbitrary(-entropy, entropy)
            const shift = getRandomArbitrary(-amplitude, amplitude)

            p.bezierVertex(
              left,
              top + shift,
              left,
              top + shift,
              left,
              top + shift
            )

            // console.log(
            //   left,
            //   top + shift,
            //   left,
            //   top + shift,
            //   left,
            //   top + shift
            // )
          }

          if (column === gridSize) {
            p.endShape()
          }
        }
      }

      const offset = {
        x: canvasSize.width / 2,
        y: canvasSize.height / 2
      }
    }
  }

  let myp5 = new p5(sketch)
}

function updateData(data) {
  if (webAudioStarted) {
    // console.log("received: %s", event.data);
    const json = JSON.parse(data)
    console.log(json)

    const index = json.i - 1
    const value = json.v

    if (json.e === 'l') {
      // console.log('laserTrigger', index, value)
      const element = document.getElementById(`laser${index}`)

      if (element) {
        element.innerText = value
      }

      if (value < 8190 && value >= 0) {
        // console.log('changed', value)
        // if (index === 0) {
        //   console.log(value, laserSensorsData[0], value != laserSensorsData[0])
        // }

        if (index === 5 && value != laserSensorsData[0]) {
          const now = Tone.now()

          lead.instrument[0].node.triggerAttack(
            value >= 1300 ? 1300 : value,
            now
          )
        } else if (index === 1 && value != laserSensorsData[1]) {
          const now = Tone.now()
          bass.instrument[0].node.triggerAttack(value, now)
        } else if (index === 4 && value != laserSensorsData[2]) {
          const now = Tone.now()
          solo.instrument[0].node.triggerAttack(value, now)
        }

        if (index === 3) {
          laserSensorsData[index] = value > 180 ? 180 : parseInt(value / 4)
        } else if (index === 4) {
          // laserSensorsData[index] = value > 300 ? 300 : value
          laserSensorsData[index] = parseInt(value / 3)
        } else if (index === 5) {
          laserSensorsData[index] = parseInt(value / 3)
        } else {
          laserSensorsData[index] = value
        }
      } else {
        // if (laserSensorsData[index] != 8190) {
        // laserSensorsData[index] = value

        if (index === 0) {
          const now = Tone.now()
          lead.instrument[0].node.triggerRelease(now + 1)
        } else if (index === 1) {
          const now = Tone.now()
          bass.instrument[0].node.triggerRelease(now + 1)
        } else if (index === 2) {
          const now = Tone.now()
          solo.instrument[0].node.triggerRelease(now + 1)
        }
        // }
      }
      // } else if (json.e === 't') {
      //   const element = document.getElementById(`laser7`)
      //
      //   const volt = (5 / 1023) * value
      //
      //   if (element) {
      //     element.innerText = volt
      //   }
      //
      //   laserSensorsData[0] = volt
      //   console.log(volt)

      // console.log('trigger', value, (5 / 1023) * value)
      // if (volt >= 4.0) {
      // laserSensorsData[0] = 255
      // } else {
      // laserSensorsData[0] = 0
      // }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  addCanvasContainer()
  addStartButton()
  // addDebugPanel()
})
