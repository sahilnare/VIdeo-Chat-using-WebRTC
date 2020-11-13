import React, {Component} from "react";
import { v1 as uuid } from "uuid";

class CreateRoom extends Component {

    constructor(props) {
      super(props);
      this.state = {
        rooms: {}
      }
    }

    componentDidMount() {
      fetch('/api/getRooms').then(res => res.json()).then(res => {
        this.setState({rooms: res.rooms});
      });
    }

    create = () => {
        const id = uuid();
        this.props.history.push(`/room/${id}`);
    }

    joinRoom = (roomID) => {
      this.props.history.push(`/room/${roomID}`);
    }

    render() {
      return (
        <>
          <div>
            <button onClick={this.create}>Create room</button>
          </div>
          <div>
            {Object.keys(this.state.rooms).map(room => {
              return (
                <button key={room} onClick={() => this.joinRoom(room)}>Enter {room}</button>
              );
            })}
          </div>
        </>
      );
    }
};

export default CreateRoom;
