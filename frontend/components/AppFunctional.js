import React, { useState } from "react";
import axios from "axios";

export default function AppFunctional({ className }) {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [steps, setSteps] = useState(0);
  const [index, setIndex] = useState(4);

  const getXY = () => {
    return {
      x: (index % 3) + 1,
      y: index < 3 ? 1 : index < 6 ? 2 : index < 9 && 3,
    };
  };

  const getXYMessage = () => {
    const { x, y } = getXY();

    return `Coordinates (${x}, ${y})`;
  };

  const reset = () => {
    setMessage("");
    setEmail("");
    setSteps(0);
    setIndex(4);
  };

  const getNextIndex = (direction) => {
    let currentIndex = index;

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

  const move = (evt) => {
    const nextIndex = getNextIndex(evt.target.id);

    if (index === nextIndex) {
      setMessage(`You can't go ${evt.target.id}`);
    } else {
      setMessage("");
      setSteps(steps + 1);
      setIndex(nextIndex);
    }
  };

  const onChange = (evt) => {
    setEmail(evt.target.value);
  };

  const onSubmit = (evt) => {
    evt.preventDefault();

    const coordinates = getXY();
    axios({
      method: "POST",
      url: "http://localhost:9000/api/result",
      data: {
        ...coordinates,
        steps: steps,
        email: email,
      },
    })
      .then((response) => {
        setMessage(response.data?.message);
        setEmail("");
      })
      .catch((error) => {
        setMessage(error.response.data?.message);
        setEmail("");
      });
  };

  return (
    <div id="wrapper" className={className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">{`You moved ${steps} time${steps === 1 ? "" : "s"}`}</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className={`square${idx === index ? " active" : ""}`}>
            {idx === index ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>
          LEFT
        </button>
        <button id="up" onClick={move}>
          UP
        </button>
        <button id="right" onClick={move}>
          RIGHT
        </button>
        <button id="down" onClick={move}>
          DOWN
        </button>
        <button id="reset" onClick={reset}>
          reset
        </button>
      </div>
      <form>
        <input
          id="email"
          type="email"
          placeholder="type email"
          value={email}
          onChange={onChange}
        ></input>
        <input id="submit" type="submit" onClick={onSubmit}></input>
      </form>
    </div>
  );
}
