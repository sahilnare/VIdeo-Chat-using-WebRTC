import React, { Component } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

import Video from './Video';


const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};

class Room extends Component {

  constructor(props) {
    super(props);
    this.state = {
      peers: []
    }
    this.videoRef = React.createRef();
    this.userVideo = React.createRef();
    this.peersRef = React.createRef();
  }


  componentDidMount() {
    const roomID = this.props.match.params.roomID;
    this.socket = io.connect("/");
    this.peersRef.current = [];

    navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
      this.userVideo.current.srcObject = stream;

      this.socket.emit("join room", roomID);

      this.socket.on("all users", users => {
        const peers = [];
        users.forEach(userID => {
          const peer = this.createPeer(userID, this.socket.id, stream);
          this.peersRef.current.push({
            peerID: userID,
            peer
          });
          peers.push(peer);
        });
        this.setState({peers: peers});
      });

      this.socket.on("user joined", payload => {
        const peer = this.addPeer(payload.signal, payload.callerID, stream);
        this.peersRef.current.push({
          peerID: payload.callerID,
          peer
        });
        this.setState(prevState => {
          return {peers: [...prevState.peers, peer]}
        });
      });

      this.socket.on("receiving returned signal", payload => {
        const item = this.peersRef.current.find(p => p.peerID === payload.id);
        item.peer.signal(payload.signal);
      });
    });
  }

  createPeer = (userToSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
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
      trickle: false,
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
    console.log(this.peersRef);
    return (
        <div>
          <div>
            <h1>Room ID: {roomID}</h1>
          </div>
          <div>
            <video muted ref={this.userVideo} autoPlay playsInline />
            {this.state.peers.map((peer, index) => {
                return (
                    <Video key={index} peer={peer} />
                );
            })}
          </div>
        </div>
    );
  }

};

export default Room;
