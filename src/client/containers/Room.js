import React, { Component } from 'react';
import io from "socket.io-client";
// import Peer from "simple-peer";

class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      yourID: null,
      users: null,
      stream: null,
      receivingCall: null,
      caller: null,
      callerSignal: null,
      callAccepted: null
    }
    this.userVideo = React.createRef();
    this.partnerVideo = React.createRef();
  }

  componentDidMount() {
    this.socket = io.connect("/");

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      this.setState({stream: stream});
      if (this.userVideo.current) {
        this.userVideo.current.srcObject = stream;
      }
    });

    this.socket.on("yourID", (id) => {
      console.log(id);
    });

    this.socket.on("allUsers", (users) => {
      console.log(users);
    });

    this.socket.on("hey", (data) => {

    });
  }

  callPeer = (id) => {

  }

  acceptCall = () => {

  }

  render() {
    let UserVideo;
    if (this.state.stream) {
      UserVideo = (
        <video playsInline muted ref={this.userVideo} autoPlay />
      );
    }

    let PartnerVideo;
    if (this.state.callAccepted) {
      PartnerVideo = (
        <video playsInline ref={this.partnerVideo} autoPlay />
      );
    }

    let incomingCall;
    if (this.state.receivingCall) {
      incomingCall = (
        <div>
          <h1>{this.state.caller} is calling you</h1>
          <button onClick={this.acceptCall}>Accept</button>
        </div>
      )
    }

    return (
      <>
        <div>
          {UserVideo}
          {PartnerVideo}
        </div>
      </>
    );
  }
}

export default Room;
