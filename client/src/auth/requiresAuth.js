import React from "react";
import axios from "axios";

// like Middleware
// Higher Order Function
// pass every component in this function that needs protection: export default requiresAuth(Component);

axios.interceptors.request.use(
  function(requestConfig) {
    // set token (named jwt on localStorage) on authorization header
    requestConfig.headers.authorization = localStorage.getItem("jwt");

    // return new version of requestConfig
    return requestConfig;
  },
  function(error) {
    return Promise.reject(error);
  }
);

export default function(Component) {
  return class Authenticated extends React.Component {
    signup = e => {
      this.props.history.push("/signup");
    };

    signin = e => {
      this.props.history.push("/signin");
    };
    render() {
      const token = localStorage.getItem("jwt");
      const notAllowed = (
        <div>
          <h2>Please Sign Up or Sign In to See Users</h2>
          <button onClick={this.signup}>Sign Up</button>
          <button onClick={this.signin}>Sign In</button>
        </div>
      );

      // conditional render
      return <div> {token ? <Component {...this.props} /> : notAllowed} </div>;
    }
  };
}
