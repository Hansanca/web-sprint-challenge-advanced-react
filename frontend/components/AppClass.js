import React from 'react';
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 3 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

const grid = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export default class AppClass extends React.Component {
  constructor(props) {
    super(props);
    this.state ={ ...initialState}
  }
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  componentDidMount(){
    console.log(this.getXY())
    console.log(this.getXYMessage())
  }

  getXY = () => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    return {
      x: Math.floor(this.state.index % 3) * 3,
      y: Math.floor(this.state.index / 3) * 3,
    }
  }

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const coordinates = this.getXY()
    return `Coordinates (${coordinates.x}, ${coordinates.y})`
  }

  reset = () => {
    this.setState({...initialState})
  }

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  onChange = (evt) => {
    this.setState({[evt.target.id]: evt.target.value})
  }

  onSubmit = async () => {
    if (!this.state.email) {
      this.setState({message: 'Ouch: email is required'})
    } else {
    const coordinates = this.getXY()
    const result = await axios({
        method: 'POST',
        url: 'http://localhost:9000/api/result',
        data: {
          ...coordinates,
          steps: this.state.steps,
          email: this.state.email
        }
      })

    this.setState({message: result.data?.message})
    }
    // Use a POST request to send a payload to the server.
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage}</h3>
          <h3 id="steps">{`You moved ${this.state.steps} times`}</h3>
        </div>
        <div id="grid">
          {
            grid.map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left">LEFT</button>
          <button id="up">UP</button>
          <button id="right">RIGHT</button>
          <button id="down">DOWN</button>
          <button id="reset">reset</button>
        </div>
        <form>
          <input id="email" type="email" placeholder="type email" onChange={this.onChange}></input>
          <input id="submit" type="submit" onClick={this.onSubmit}></input>
        </form>
      </div>
    )
  }
}
