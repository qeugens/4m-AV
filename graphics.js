import p5 from 'p5'
import * as Tone from 'tone'
import * as lead from './src/lead.js'
import * as bass from './src/bass.js'
import * as solo from './src/solo.js'
import { getRandomArbitrary } from './src/utilities.js'

let frameRateValue = 10
let colorIndex = 0
let sketch = null

let webAudioStarted = false

const handleFrameRateChange = (event) => {
  const newFrameRate = Number(event.target.value)
  frameRateValue = newFrameRate
  sketch.frameRate(frameRateValue)
}

const handleColorChange = (event) => {
  const newColorIndex = Number(event.target.value)
  colorIndex = newColorIndex
}

const handleReset = () => {
  sketch.init()
}

const createSketch = (p) => {
  let w
  let columns
  let rows
  let board
  let next
  // color change
  let colour1 = p.color(144, 49, 54)
  let colour2 = p.color(313, 72, 68)
  let colours = [colour1, colour2]
  // frameRate change
  let frameRate = getRandomArbitrary(1, 30)

  p.setup = () => {
    // Set simulation framerate to 10 to avoid flickering
    p.frameRate(frameRate) // change this with knob (1-20)
    p.createCanvas(1512, 500) // 1512, 867
    w = 20
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
  }

  p.draw = () => {
    p.background(255)
    p.generate()
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        const selectedColor = colours[colorIndex]
        if (board[i][j] === 1) p.fill(selectedColor)
        // change color and type of wave (button set)
        else {
          p.fill(255)
        }
        p.stroke(0)
        p.rect(i * w, j * w, w - 1, w - 1)
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
    let temp = board
    board = next
    next = temp
  }
}
// const renderUI = () => {
//   const containerElement = document.getElementById('container')
//   const sketchElement = document.createElement('div')
//   sketchElement.id = 'sketch'
//   containerElement.appendChild(sketchElement)

//   const frameRateElement = document.createElement('div')
//   frameRateElement.id = 'frameRate'
//   const frameRateLabel = document.createElement('label')
//   frameRateLabel.htmlFor = 'frameRateRange'
//   frameRateLabel.textContent = 'Frame Rate:'
//   const frameRateRange = document.createElement('input')
//   frameRateRange.type = 'range'
//   frameRateRange.id = 'frameRateRange'
//   frameRateRange.min = '1'
//   frameRateRange.max = '30'
//   frameRateRange.value = frameRateValue
//   frameRateRange.addEventListener('input', handleFrameRateChange)
//   const frameRateValueSpan = document.createElement('span')
//   frameRateValueSpan.textContent = frameRateValue
//   frameRateElement.appendChild(frameRateLabel)
//   frameRateElement.appendChild(frameRateRange)
//   frameRateElement.appendChild(frameRateValueSpan)
//   containerElement.appendChild(frameRateElement)

//   const colorElement = document.createElement('div')
//   colorElement.id = 'colour'
//   const colorLabel = document.createElement('label')
//   colorLabel.htmlFor = 'colorRange'
//   colorLabel.textContent = 'Color:'
//   const colorRange = document.createElement('input')
//   colorRange.type = 'range'
//   colorRange.id = 'colorRange'
//   colorRange.min = '0'
//   colorRange.max = '1'
//   colorRange.value = colorIndex
//   colorRange.addEventListener('input', handleColorChange)
//   colorElement.appendChild(colorLabel)
//   colorElement.appendChild(colorRange)
//   containerElement.appendChild(colorElement)

//   const resetButton = document.createElement('button')
//   resetButton.id = 'resetButton'
//   resetButton.textContent = 'Reset'
//   resetButton.addEventListener('click', handleReset)
//   containerElement.appendChild(resetButton)
// }

document.addEventListener('DOMContentLoaded', () => {
  sketch = new p5(createSketch)
  // renderUI()
})
