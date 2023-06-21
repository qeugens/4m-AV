import p5 from 'p5'
import { getRandomArbitrary } from './src/utilities.js'

import './src/index.css'

import * as Tone from 'tone'
import * as lead from './src/lead.js'

// import * as sampler from './src/sampler.js'

export const wsConnection = new WebSocket('ws://localhost:3000/websocket')

let pot = 0
let buttons = 0
let dist = 0

let generationSpeed = 1

let frameRateValue = 10
let colorIndex = 0
let sketch = null
let buttonEventListener
// let canvasSize = {}

let webAudioStarted = false

// const image = new Image()
// image.src = './src/images/длавмь.png'

const waves = [
  'fatsine',
  'square',
  'fatsawtooth',
  'fattriangle',
  'fmsine',
  'fmsquare',
  'fmsawtooth',
  'fmtriangle',
  'amsine',
  'amsquare',
  'amsawtooth',
  'amtriangle',
  'pulse',
  'pwm',
  'sawtooth',
  'sine'
]

function map(value, start1, stop1, start2, stop2) {
  return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2
}
function au() {
  lead.instrument[0].node.triggerAttackRelease(Tone.Sequence)
}
function resetGeneration() {
  sketch.remove()
  sketch = new p5(sketchFunction, document.getElementById('sketch-container'))
}

wsConnection.onopen = function () {
  console.log('Соединение установлено.')
}

wsConnection.onclose = function (event) {
  if (event.wasClean) {
    console.log('Соединение закрыто чисто')
  } else {
    console.log('Обрыв соединения') // например, "убит" процесс сервера
  }
  console.log('Код: ' + event.code + ' причина: ' + event.reason)
}

wsConnection.onerror = function (error) {
  console.log('Ошибка ' + error.message)
}

wsConnection.onmessage = function message(event) {
  // console.log("received: %s", event.data);

  // console.log(event)
  console.log(event.data)
  // console.log(JSON.parse(event.data))

  let jsonData = JSON.parse(event.data)

  if (pot != parseInt(jsonData['p'])) {
    pot = parseInt(jsonData['p'])

    const delayWet = pot >= 1000 ? 1 : pot / 1000
    lead.instrument[4].node.wet.value = delayWet
    lead.instrument[2].node.wet.value = delayWet
    lead.instrument[3].node.wet.value = delayWet
  }

  dist = parseInt(jsonData['d'])

  if (dist < 0 || dist > 20) {
    lead.instrument[6].node.mute = true
  } else {
    lead.instrument[6].node.mute = false
  }

  if (buttons != parseInt(jsonData['b'])) {
    buttons = parseInt(jsonData['b'])

    lead.instrument[0].node.oscillator.type = waves[buttons]
  }

  generationSpeed = map(pot, 0, 1023, 1, 30)
}

function addStartButton() {
  const startButton = document.createElement('div')
  startButton.id = 'startButton'
  startButton.innerText = 'хдыщь!'

  const startText = document.createElement('div')
  startText.id = 'startText'
  startText.innerText = 'так звучит железяка↑'

  const startContainer = document.createElement('div')
  startContainer.id = 'startContainer'

  buttonEventListener = startButton.addEventListener('click', () => {
    init()
    const topTypoContainer = document.getElementById('topTypoContainer')
    topTypoContainer.style.display = 'flex'
    const echo1 = document.getElementById('echo1')
    echo1.style.display = 'flex'
    const echo2 = document.getElementById('echo2')
    echo2.style.display = 'flex'
    au()
  })

  startContainer.appendChild(startButton)
  startContainer.appendChild(startText)
  document.body.appendChild(startContainer)
}

function removeStartButton() {
  const button = document.getElementById('startContainer')

  button.removeEventListener('click', () => {
    init()
  })

  button.remove()
}

function addTypo() {
  const container = document.body
  container.style.margin = '0'

  const frame = document.createElement('div')
  frame.classList.add('frame')
  frame.id = 'frame'
  container.appendChild(frame)

  //typography

  const topTypoContainer = document.createElement('div')
  topTypoContainer.id = 'topTypoContainer'
  topTypoContainer.style.display = 'none'
  document.body.appendChild(topTypoContainer)

  const leftTypoContainer = document.createElement('div')
  leftTypoContainer.id = 'leftTypoContainer'
  topTypoContainer.appendChild(leftTypoContainer)

  const bams = document.createElement('div')
  bams.id = 'bams'
  bams.innerText = 'бамс'
  leftTypoContainer.appendChild(bams)

  const pumpum = document.createElement('div')
  pumpum.id = 'pumpum'
  pumpum.innerText = 'пум-пум'
  leftTypoContainer.appendChild(pumpum)

  const hscha = document.createElement('div')
  hscha.id = 'hscha'
  hscha.innerText = 'х-ща'
  leftTypoContainer.appendChild(hscha)

  const zhelezyaka = document.createElement('div')
  zhelezyaka.id = 'zhelezyaka'
  zhelezyaka.innerText = 'железяка↓'
  topTypoContainer.appendChild(zhelezyaka)

  const rightTypoContainer = document.createElement('div')
  rightTypoContainer.id = 'rightTypoContainer'
  topTypoContainer.appendChild(rightTypoContainer)

  const pampam = document.createElement('div')
  pampam.id = 'pampam'
  pampam.innerText = 'пам-пам'
  rightTypoContainer.appendChild(pampam)

  const klaz = document.createElement('div')
  klaz.id = 'klaz'
  klaz.innerText = 'клац'
  rightTypoContainer.appendChild(klaz)

  const phrr = document.createElement('div')
  phrr.id = 'phrr'
  phrr.innerText = 'фрр'
  rightTypoContainer.appendChild(phrr)

  const echo1 = document.createElement('div')
  echo1.id = 'echo1'
  echo1.style.display = 'none'
  document.body.appendChild(echo1)

  const mlem1 = document.createElement('div')
  mlem1.id = 'mlem1'
  mlem1.innerText = 'млем'
  echo1.appendChild(mlem1)

  const mlem2 = document.createElement('div')
  mlem2.id = 'mlem2'
  mlem2.innerText = 'млем'
  echo1.appendChild(mlem2)

  const mlem3 = document.createElement('div')
  mlem3.id = 'mlem3'
  mlem3.innerText = 'млем'
  echo1.appendChild(mlem3)

  const echo2 = document.createElement('div')
  echo2.id = 'echo2'
  echo2.style.display = 'none'
  document.body.appendChild(echo2)

  const bums1 = document.createElement('div')
  bums1.id = 'bums1'
  bums1.innerText = 'бумс'
  echo2.appendChild(bums1)

  const bums2 = document.createElement('div')
  bums2.id = 'bums2'
  bums2.innerText = 'бумс'
  echo2.appendChild(bums2)

  const bums3 = document.createElement('div')
  bums3.id = 'bums3'
  bums3.innerText = 'бумс'
  echo2.appendChild(bums3)
}

async function init() {
  removeStartButton()

  Tone.Transport.bpm.value = 140

  sketch = (p) => {
    let w
    let columns
    let rows
    let board
    let next

    // color change
    let colour1 = p.color(80, 195, 126)
    let colour2 = p.color(232, 116, 206)
    let colour3 = p.color(222, 203, 86)
    let colour4 = p.color(221, 113, 52)
    let colour5 = p.color(27, 204, 228)
    let colour6 = p.color(24, 89, 255)
    let colour7 = p.color(136, 98, 245)
    let colour8 = p.color(249, 70, 70)
    let colour9 = p.color(211, 211, 211)
    let colour10 = p.color(39, 39, 39)
    let colour11 = p.color(27, 146, 138)
    let colour12 = p.color(234, 151, 105)
    let colour13 = p.color(116, 90, 76)
    let colour14 = p.color(92, 142, 188)
    let colour15 = p.color(28, 136, 104)
    let colour16 = p.color(100, 200, 50)

    let colours = [
      colour1,
      colour2,
      colour3,
      colour4,
      colour5,
      colour6,
      colour7,
      colour8,
      colour9,
      colour10,
      colour11,
      colour12,
      colour13,
      colour14,
      colour15,
      colour16
    ]

    p.setup = () => {
      p.frameRate(10) // change this with knob (1-30)
      p.createCanvas(1470, 750) // 1512, 867
      w = 15
      // Calculate columns and rows
      columns = p.floor(p.width / w)
      rows = p.floor(p.height / w)
      // Wacky way to make a 2D array is JS
      board = new Array(columns)
      for (let i = 0; i < columns; i++) {
        board[i] = new Array(rows)
      }
      // Going to use multiple 2D arrays and swap them
      next = new Array(columns)
      for (let i = 0; i < columns; i++) {
        next[i] = new Array(rows)
      }
      p.init()

      const canvasElement = document.querySelector('canvas')
      canvasElement.style.borderRadius = '20px'
      canvasElement.style.marginLeft = '20px'
      canvasElement.style.marginTop = '8px'
    }

    p.draw = () => {
      p.background(29)
      p.generate()
      // ctx.filter = 'blur(4px)'

      const canvas = document.querySelector('canvas')
      const context = canvas.getContext('2d')
      const selectedColor = colours[buttons]
      const fillColor = `rgb(${selectedColor.levels[0]}, ${selectedColor.levels[1]}, ${selectedColor.levels[2]})`

      const leftTypoContainerElement =
        document.getElementById('leftTypoContainer')
      leftTypoContainerElement.style.color = fillColor

      const rightTypoContainerElement =
        document.getElementById('rightTypoContainer')
      rightTypoContainerElement.style.color = fillColor

      const echoElement1 = document.getElementById('echo1')
      echoElement1.style.color = fillColor

      const echoElement2 = document.getElementById('echo2')
      echoElement2.style.color = fillColor

      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          if (board[i][j] === 1) {
            context.fillStyle = fillColor
            // change color and type of wave (button set)
          } else {
            context.fillStyle = 'rgb(29, 29, 29)'
          }

          context.strokeStyle = 'rgb(29, 29, 29)'
          context.fillRect(i * w, j * w, w - 1, w - 1)
        }
      }
    }

    // Fill board randomly
    p.init = () => {
      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          // Lining the edges with 0s
          if (i === 0 || j === 0 || i === columns - 1 || j === rows - 1)
            board[i][j] = 0
          // Filling the rest randomly
          else board[i][j] = p.floor(p.random(2))
          next[i][j] = 0
        }
      }
    }

    // The process of creating the new generation
    p.generate = () => {
      // Loop through every spot in our 2D array and check spots neighbors
      for (let x = 1; x < columns - 1; x++) {
        for (let y = 1; y < rows - 1; y++) {
          // Add up all the states in a 3x3 surrounding grid
          let neighbors = 0
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              neighbors += board[x + i][y + j]
            }
          }

          // A little trick to subtract the current cell's state since
          // we added it in the above loop
          neighbors -= board[x][y]
          // Rules of Life
          if (board[x][y] === 1 && neighbors < 2) next[x][y] = 0 // Loneliness
          else if (board[x][y] === 1 && neighbors > 3)
            next[x][y] = 0 // Overpopulation
          else if (board[x][y] === 0 && neighbors === 3)
            next[x][y] = 1 // Reproduction
          else next[x][y] = board[x][y] // Stasis
        }
      }

      // Swap!
      // let temp = board
      // board = next
      // next = temp
      p.frameRate(200 / generationSpeed)

      if (pot == 0) {
        pot = 5
      }

      if (dist < 20) {
        let temp = board
        board = next
        next = temp
      }
      // if (dist < 20) {
      //   columns = p.floor(p.width / w)
      //   rows = p.floor(p.height / w)
      //   board = new Array(columns)
      //   for (let i = 0; i < columns; i++) {
      //     board[i] = new Array(rows)
      //   }
      //   next = new Array(columns)
      //   for (let i = 0; i < columns; i++) {
      //     next[i] = new Array(rows)
      //   }
      //   p.init()
      // }

      // handleFrameRateChange(pot)
      // if (dist < 10) {
      //   lead.instrument[0].node.triggerAttackRelease('C5', '1n')
      // }

      // const handleReset = () => {
      //   sketch.init()
      // }
    }
  }

  let myp5 = new p5(sketch)
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.style.backgroundColor = '#101010'

  // document.frame.style.backgroundColor = 'red'
  // document.getElementById('defaultCanvas0').style.borderRadius = '20px'
  addTypo()
  addStartButton()
})
