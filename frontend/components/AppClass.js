import React from "react";
import axios from "axios";

const initialState = {
  message: "",
  email: "",
  index: 4,
  steps: 0,
};

export default class AppClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...initialState };
  }

  getXY = () => {
    return {
      x: (this.state.index % 3) + 1,
      y:
        this.state.index < 3
          ? 1
          : this.state.index < 6
          ? 2
          : this.state.index < 9 && 3,
    };
  };

  getXYMessage = () => {
    const { x, y } = this.getXY();

    return `Coordinates (${x}, ${y})`;
  };

  reset = () => {
    this.setState({ ...initialState });
  };

  getNextIndex = (direction) => {
    let currentIndex = this.state.index;

    switch (direction) {
      case "left":
        if (currentIndex % 3 === 0) {
          break;
        } else {
          currentIndex = currentIndex - 1;
          break;
        }
      case "up":
        if (currentIndex < 3) {
          break;
        } else {
          currentIndex = currentIndex - 3;
          break;
        }
      case "right":
        if ((currentIndex - 2) % 3 === 0) {
          break;
        } else {
          currentIndex = currentIndex + 1;
          break;
        }
      case "down":
        if (currentIndex > 5) {
          break;
        } else {
          currentIndex = currentIndex + 3;
          break;
        }
    }

    return currentIndex;
  };

  move = (evt) => {
    const nextIndex = this.getNextIndex(evt.target.id);

    if (this.state.index === nextIndex) {
      this.setState({
        message: `You can't go ${evt.target.id}`,
      });
    } else {
      this.setState({
        index: nextIndex,
        steps: this.state.steps + 1,
        message: "",
      });
    }
  };

  onChange = (evt) => {
    this.setState({ [evt.target.id]: evt.target.value });
  };

  onSubmit = (evt) => {
    evt.preventDefault();

    const coordinates = this.getXY();
    axios({
      method: "POST",
      url: "http://localhost:9000/api/result",
      data: {
        ...coordinates,
        steps: this.state.steps,
        email: this.state.email,
      },
    })
      .then((response) => {
        this.setState({ message: response.data?.message, email: "" });
      })
      .catch((error) => {
        this.setState({ message: error.response.data?.message, email: "" });
      });
  };

  render() {
    const { className } = this.props;
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">{`You moved ${this.state.steps} time${
            this.state.steps === 1 ? "" : "s"
          }`}</h3>
        </div>
        <div id="grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div
              key={idx}
              className={`square${idx === this.state.index ? " active" : ""}`}
            >
              {idx === this.state.index ? "B" : null}
            </div>
          ))}
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={this.move}>
            LEFT
          </button>
          <button id="up" onClick={this.move}>
            UP
          </button>
          <button id="right" onClick={this.move}>
            RIGHT
          </button>
          <button id="down" onClick={this.move}>
            DOWN
          </button>
          <button id="reset" onClick={this.reset}>
            reset
          </button>
        </div>
        <form>
          <input
            id="email"
            type="email"
            placeholder="type email"
            value={this.state.email}
            onChange={this.onChange}
          ></input>
          <input id="submit" type="submit" onClick={this.onSubmit}></input>
        </form>
      </div>
    );
  }
}
