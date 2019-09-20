import React, { Component } from 'react';

const style = {
  border: '1px solid gray',
  backgroundColor: 'white',
};

class Canvas extends Component {
  constructor() {
    super();
    this.state = { drawing: false };
  }

  getContext() {
    return this.refs.canvas.getContext('2d');
  }

  startDrawing(x, y) {
    this.setState({ drawing: true });
    const ctx = this.getContext();
    ctx.lineWidth = 30;
    ctx.moveTo(x, y);
  }

  draw(x, y) {
    if (!this.state.drawing) {
      return;
    }
    const ctx = this.getContext();
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  endDrawing() {
    this.setState({ drawing: false });
  }

  render() {
    return (
      <canvas
        ref="canvas"
        id="input-canvas" width="300" height="300"
        onMouseDown={e => this.startDrawing(e.nativeEvent.offsetX, e.nativeEvent.offsetY)}
        onMouseUp={() => this.endDrawing()}
        onMouseLeave={() => this.endDrawing()}
        onMouseMove={e => this.draw(e.nativeEvent.offsetX, e.nativeEvent.offsetY)}
        style={style}
      />
    );
  }
}
export default Canvas;