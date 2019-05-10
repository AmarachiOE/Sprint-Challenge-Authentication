import React from "react";
import axios from "axios";
import requiresAuth from "../auth/requiresAuth";

class Jokes extends React.Component {
  state = {
    jokes: []
  };

  componentDidMount() {
    const endpoint = "http://localhost:3300/api/jokes";

    axios
      .get(endpoint)
      .then(res => {
        console.log("RES.DATA:", res.data); // where is the array data actually located on res.data??!?! on res.data or is there res.data.jokes? CHECK!!!
        this.setState({ jokes: res.data });
        console.log("ON STATE:", this.state.jokes);
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        <h2>Enjoy These Dad Jokes!</h2>
        <div className="jokes-container">
          {this.state.jokes.map(joke => (
            <div className="each-joke-div" key={joke.id}>
                <p>
                  {joke.joke}
                </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default requiresAuth(Jokes);
