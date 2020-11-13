import React, { Component } from "react";


class Video extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
    this.videoRef = React.createRef();
  }

  componentDidMount() {
    this.props.peer.on("stream", stream => {
        this.videoRef.current.srcObject = stream;
    })
  }

  render() {
    return (
      <video playsInline autoPlay ref={this.videoRef} />
    );
  }

}

export default Video;
