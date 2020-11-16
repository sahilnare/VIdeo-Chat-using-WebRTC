import React, { Component } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
// import Wave from "@foobar404/wave"
import Video from './Video';


const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};

class Room extends Component {

  constructor(props) {
    super(props);
    this.state = {
      peers: [],
      stream: null
    }
    this.userVideo = React.createRef();
    this.peersRef = React.createRef();
  }


  componentDidMount() {
    const roomID = this.props.match.params.roomID;
    this.socket = io.connect("/");
    this.peersRef.current = [];

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      this.userVideo.current.srcObject = stream;
      // let wave = new Wave();
      //
      // wave.fromElement("userAudio", "userCanvas", {
      //   type: "star",
      //   colors: ["red", "white", "blue"]
      // });

      this.socket.emit("join room", roomID);

      this.socket.on("all users", users => {
        const peers = [];
        users.forEach(userID => {
          const peer = this.createPeer(userID, this.socket.id, stream);
          this.peersRef.current.push({
            peerID: userID,
            peer
          });
          peers.push({
            peerID: userID,
            peer
          });
        });
        this.setState({peers: peers});
      });

      this.socket.on("user joined", payload => {
        const peer = this.addPeer(payload.signal, payload.callerID, stream);
        this.peersRef.current.push({
          peerID: payload.callerID,
          peer
        });
        const peerObj = {
          peerID: payload.callerID,
          peer
        }
        this.setState(prevState => {
          return {peers: [...prevState.peers, peerObj]}
        });
      });

      this.socket.on("receiving returned signal", payload => {
        const item = this.peersRef.current.find(p => p.peerID === payload.id);
        item.peer.signal(payload.signal);
      });

      this.socket.on("user left", id => {
        const peerObj = this.peersRef.current.find(p => p.peerID === id);
        if(peerObj) {
          peerObj.peer.destroy();
        }
        const peers = this.peersRef.current.filter(p => p.peerID !== id);
        this.peersRef.current = peers;
        this.setState({peers: peers});
      });
    });
  }

  createPeer = (userToSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: true,
      config: {
        iceServers: [
            {
              urls: "stun:numb.viagenie.ca",
              username: "sahilnare78@gmail.com",
              credential: "holapeeps"
            },
            {
              urls: "turn:numb.viagenie.ca",
              username: "sahilnare78@gmail.com",
              credential: "holapeeps"
            }
        ]
      },
      stream: stream
    });

    peer.on("signal", signal => {
      this.socket.emit("sending signal", {userToSignal, callerID, signal});
    });

    return peer;
  }

  addPeer = (incomingSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: true,
      config: {
        iceServers: [
            {
              urls: "stun:numb.viagenie.ca",
              username: "sahilnare78@gmail.com",
              credential: "holapeeps"
            },
            {
              urls: "turn:numb.viagenie.ca",
              username: "sahilnare78@gmail.com",
              credential: "holapeeps"
            }
        ]
      },
      stream: stream
    });

    peer.on("signal", signal => {
      this.socket.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  render() {
    const roomID = this.props.match.params.roomID;
    if(this.state.stream) {
      console.log(this.state.stream.getTracks());
    }
    return (
        <div>
          <div>
            <h1>Room ID: {roomID}</h1>
          </div>
          <div>
            {/*<canvas id="userCanvas" height="500" width="500" />
            <audio id="userAudio" muted ref={this.userVideo} autoPlay />*/}
            <video muted ref={this.userVideo} autoPlay playsInline />
            {this.state.peers.map((peer, index) => {
                return (
                    <Video key={peer.peerID} id={peer.peerID} peer={peer.peer} />
                );
            })}
          </div>
        </div>
    );
  }

};

export default Room;
