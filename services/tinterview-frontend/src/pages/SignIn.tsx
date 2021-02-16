import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import GoogleLogin from "react-google-login";
import { Link } from "react-router-dom";

require("dotenv").config();

const SIGNIN = gql`
  mutation($email: String!, $pwd: String!) {
    signIn(email: $email, pwd: $pwd) {
      token
      email
    }
  }
`;
const GOOGLESIGNIN = gql`
  mutation($tokenId: String!) {
    googleSignIn(tokenId: $tokenId)
  }
`;

const SignInPage = () => {
  const [error, setError] = useState(undefined);
  const [signIn] = useMutation(SIGNIN);
  const [googleSignIn] = useMutation(GOOGLESIGNIN);

  const buttonHandler = () => {
    signIn({
      variables: {
        email: (document.getElementById("emailInput")! as HTMLInputElement)
          .value,
        pwd: (document.getElementById("pwdInput")! as HTMLInputElement).value
      }
    })
      .then(data => {
        console.log(data);
      })
      .catch(mutationError => {
        console.log(mutationError);
        setError(mutationError);
      });
  };
  const onSuccess = (res: any) => {
    console.log("Login Success: currentUser:", res);
    googleSignIn({
      variables: {
        tokenId: res.tokenId
      }
    })
      .then(data => {
        // data.id asi se usa
        // window.location.href = `/home`;
        console.log(data.data.googleSignIn);
      })
      .catch(mutationError => {
        setError(mutationError);
        console.log(mutationError);
      });
  };

  const onFailure = (res: any) => {
    console.log("Login failed: res:", res);
    // 112326242832645253466
  };

  return (
    // eslint-disable-next-line
    <div className="App">
      <div className="Header">
        <img
          className="CWLogo"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/CoverWallet_Logo.png/478px-CoverWallet_Logo.png"
          alt="coverwallet logo"
        />
        <h1 className="Center">Tinterview</h1>
        <div />
      </div>
      {error ? (
        <div className="Error">
          <img
            className="WarningRed"
            src="https://cdn.discordapp.com/attachments/733398836457898034/788353198805090304/error-icon-21.png"
            alt="warning red"
          />
          <div className="Label-Error">Incorrect email or password</div>
        </div>
      ) : null}

      <div className="SignInBox">
        <h1 className="padding">Sign in</h1>
        <div>Email</div>
        <input
          className="Input"
          type="text"
          id="emailInput"
          placeholder="my@company.com"
        />
        <div className="SignIn-Row">
          <div>Password</div>
          <Link to="/reset-password">
            <a href="/reset-password" className="Link">
              {" "}
              Forgot password?
            </a>
          </Link>
        </div>
        <input className="Input" type="password" id="pwdInput" />
        <button
          className="RegisterButton"
          type="button"
          onClick={() => buttonHandler()}
        >
          Sign in
        </button>
        <GoogleLogin
          clientId={process.env.REACT_APP_CLIENT_ID || ""}
          buttonText="Login"
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy="single_host_origin"
          style={{ marginTop: "100px" }}
        />
      </div>
      <div className="SignIn-Row">
        <div>New in CoverWallet?</div>
        <Link to="/sign-up">
          <a href="/sign-up" className="Color">
            Sign up
          </a>
        </Link>
      </div>
    </div>
  );
};

export default SignInPage;
