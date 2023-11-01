import React from "react";
import io from "socket.io-client";

class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            message: "",
            messages: [],
        };

        this.socket = io("localhost:3001");

        this.socket.on("RECEIVE_MESSAGE", function (data) {
            addMessage(data);
        });

        const addMessage = (data) => {
            console.log(data);
            this.setState({ messages: [...this.state.messages, data] });
            console.log(this.state.messages);
        };

        this.sendMessage = (ev) => {
            ev.preventDefault();
            this.socket.emit("SEND_MESSAGE", {
                author: this.state.username,
                message: this.state.message,
            });
            this.setState({ message: "" });
        };
    }
    render() {
        return (
            <>
                <ul id="messages">
                    {this.state.messages.map((message) => {
                        return (
                            <li>
                                {message.author}: {message.message}
                            </li>
                        );
                    })}
                </ul>
                <div id="form">
                    <input
                        id="input"
                        type="text"
                        placeholder="Username"
                        value={this.state.username}
                        onChange={(ev) =>
                            this.setState({
                                username: ev.target.value,
                            })
                        }
                        className="form-control"
                    />
                    <br />
                    <input
                        id="input"
                        type="text"
                        placeholder="Message"
                        className="form-control"
                        value={this.state.message}
                        onChange={(ev) =>
                            this.setState({
                                message: ev.target.value,
                            })
                        }
                    />
                    <br />
                    <button
                        onClick={this.sendMessage}
                        className="btn btn-primary form-control"
                    >
                        Send
                    </button>
                </div>
            </>
        );
    }
}

export default Chat;
