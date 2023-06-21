import React, { Component } from 'react'
import p5 from 'p5'

export default class Sketch extends Component {
  componentDidMount() {
    this.sketch = new p5(this.createSketch, 'container')
  }
  createSketch = (p) => {
    p.setup = () => {
      p.createCanvas(720, 400)
    }

    p.draw = () => {
      p.background(102)

      p.push()
      p.translate(p.width * 0.2, p.height * 0.5)
      p.rotate(p.frameCount / 200.0)
      p.star(0, 0, 5, 70, 3)
      p.pop()

      p.push()
      p.translate(p.width * 0.5, p.height * 0.5)
      p.rotate(p.frameCount / 50.0)
      p.star(0, 0, 80, 100, 40)
      p.pop()

      p.push()
      p.translate(p.width * 0.8, p.height * 0.5)
      p.rotate(p.frameCount / -100.0)
      p.star(0, 0, 30, 70, 5)
      p.pop()
    }

    p.star = (x, y, radius1, radius2, npoints) => {
      let angle = p.TWO_PI / npoints
      let halfAngle = angle / 2.0
      p.beginShape()
      for (let a = 0; a < p.TWO_PI; a += angle) {
        let sx = x + p.cos(a) * radius2
        let sy = y + p.sin(a) * radius2
        p.vertex(sx, sy)
        sx = x + p.cos(a + halfAngle) * radius1
        sy = y + p.sin(a + halfAngle) * radius1
        p.vertex(sx, sy)
      }
      p.endShape(p.CLOSE)
    }
  }

  render() {
    return <div id="container"></div>
  }
}
