import React, { Component } from "react";
import Wave from "@foobar404/wave";

class AudioWave extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
    this.audioRef = React.createRef();
  }

  componentDidMount() {
    this.props.peer.on("stream", stream => {
        this.audioRef.current.srcObject = stream;
    });
    const audioID = "myAudio" + this.props.id;
    const canvasID = "myCanvas" + this.props.id;

    let wave = new Wave();

    wave.fromElement(audioID, canvasID, {
      type: "star",
      colors: ["red", "white", "blue"]
    });
  }

  render() {
    const audioID = "myAudio" + this.props.id;
    const canvasID = "myCanvas" + this.props.id;
    return (
      <>
        <canvas id={canvasID} height="500" width="500" />
        <audio id={audioID} ref={this.audioRef} autoPlay />
      </>
    );
  }

}

export default AudioWave;
