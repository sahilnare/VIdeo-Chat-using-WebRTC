import React, { Component } from 'react';
import io from "socket.io-client";
import Peer from "simple-peer";

class OneToOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
      yourID: "",
      users: {},
      stream: null,
      receivingCall: false,
      caller: "",
      callerSignal: null,
      callAccepted: false
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
      this.setState({yourID: id});
    });

    this.socket.on("allUsers", (users) => {
      console.log(users);
      this.setState({users: users});
    });

    this.socket.on("hey", (data) => {
      this.setState({receivingCall: true, caller: data.from, callerSignal: data.signal});
    });
  }

  callPeer = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: this.state.stream
    });

    peer.on("signal", data => {
      this.socket.emit("callUser", {userToCall: id, signalData: data, from: this.state.yourID});
    });

    peer.on("stream", stream => {
      if(this.partnerVideo.current) {
        this.partnerVideo.current.srcObject = stream;
      }
    });

    this.socket.on("callAccepted", signal => {
      this.setState({callAccepted: true});
      peer.signal(signal);
    });
  }

  acceptCall = () => {
    this.setState({callAccepted: true});
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: this.state.stream
    });

    peer.on("signal", data => {
      this.socket.emit("acceptCall", {signal: data, to: this.state.caller});
    });

    peer.on("stream", stream => {
      this.partnerVideo.current.srcObject = stream;
    });

    peer.signal(this.state.callerSignal);

    this.setState({receivingCall: false});
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
      );
    }

    return (
      <>
        <div>
          {UserVideo}
          {PartnerVideo}
        </div>
        <div>
          {Object.keys(this.state.users).map(key => {
            if (key === this.state.yourID) {
              return null;
            }
            return (
              <button onClick={() => this.callPeer(key)}>Call {key}</button>
            );
          })}
        </div>
        <div>
          {incomingCall}
        </div>
      </>
    );
  }
}

export default OneToOne;
