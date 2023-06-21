import * as Tone from 'tone'

let oscillator

function createNewOscillator() {
  // Create an oscillator
  oscillator = new Tone.Oscillator(440, 'square').toDestination()
  oscillator.start()
  Tone.start() // Start the audio context
}

function changeOscillatorFrequency() {
  const slider = document.getElementById('slider')
  const frequency = Tone.Midi(slider.value).toFrequency()
  oscillator.frequency.rampTo(frequency, 0.1)
}

function changeOscillatorType(type) {
  oscillator.type = type
}

function createSlider() {
  const slider = document.createElement('input')
  slider.type = 'range'
  slider.min = 0
  slider.max = 127
  slider.value = 69 // MIDI note number for A4
  slider.id = 'slider'
  document.body.appendChild(slider)

  slider.addEventListener('input', () => {
    changeOscillatorFrequency()
  })
}

function createButton(text, callback, parameter) {
  const button = document.createElement('div')
  button.innerText = text
  button.classList.add('button')
  document.body.appendChild(button)

  button.addEventListener('click', () => {
    callback(parameter)
  })
}

function createOscillatorTypeButtons() {
  const types = ['sine', 'square', 'sawtooth', 'triangle']
  types.forEach((type, i) => {
    createButton(type, changeOscillatorType, type)
  })
}

document.addEventListener('DOMContentLoaded', () => {
  const frame = document.createElement('div')
  frame.innerText = 'Art Design & Coding Community'
  frame.classList.add('frame')
  document.body.appendChild(frame)

  frame.addEventListener('click', () => {
    createNewOscillator()
    createSlider()
    createOscillatorTypeButtons()
  })
})
