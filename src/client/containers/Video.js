import React, { Component } from "react";


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
    })
  }

  render() {
    return (
      <audio playsInline autoPlay ref={this.audioRef} />
    );
  }

}

export default AudioWave;
