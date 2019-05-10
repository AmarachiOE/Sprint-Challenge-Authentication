import React from "react";
import axios from "axios";

class SignIn extends React.Component {
  state = {
    username: "",
    password: ""
  };

  handleChanges = e => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  submitForm = e => {
    e.preventDefault();
    const endpoint = "http://localhost:3300/api/login";

    axios
      .post(endpoint, this.state)
      .then(res => {
        localStorage.setItem("jwt", res.data.token);
        this.props.history.push("/jokes"); // make sure App exported withRouter(App)
      })
      .catch(err => {
        console.error("Sign In Error", err);
      });
  };

  render() {
    return (
      <div>
        <h2>Sign In</h2>
        <form onSubmit={this.submitForm}>
          <input
            id="username"
            type="text"
            value={this.state.username}
            onChange={this.handleChanges}
            placeholder="username"
          />
          <input
            id="password"
            type="password"
            value={this.state.password}
            onChange={this.handleChanges}
            placeholder="password"
          />
          <button>Sign In</button>
        </form>
      </div>
    );
  }
}

export default SignIn;
