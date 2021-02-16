import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import GoogleLogin from "react-google-login";
import { Link } from "react-router-dom";

require("dotenv").config();

const SIGNUP = gql`
  mutation($email: String!, $lastname: String!, $name: String!, $pwd: String!) {
    signUp(email: $email, lastname: $lastname, name: $name, pwd: $pwd) {
      token
      _id
    }
  }
`;
const GOOGLESIGNIN = gql`
  mutation($tokenId: String!) {
    googleSignIn(tokenId: $tokenId)
  }
`;

const SignUpPage = () => {
  const [error, setError] = useState<number | undefined>(undefined);
  const [signUp] = useMutation(SIGNUP);
  const [googleSignIn] = useMutation(GOOGLESIGNIN);
  const buttonHandler = () => {
    let typeError: number | undefined;
    const pwd = (document.getElementById("pwdInput")! as HTMLInputElement)
      .value;
    const pwdRegex = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;

    if (!pwdRegex.test(pwd)) {
      typeError = 1;
    }

    const email = (document.getElementById("emailInput")! as HTMLInputElement)
      .value;
    const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

    if (!emailRegex.test(email)) {
      typeError = 2;
    }
    if (!typeError) {
      signUp({
        variables: {
          email: (document.getElementById("emailInput")! as HTMLInputElement)
            .value,
          lastname: (document.getElementById(
            "lastnameInput"
          )! as HTMLInputElement).value,
          name: (document.getElementById("nameInput")! as HTMLInputElement)
            .value,
          pwd: (document.getElementById("pwdInput")! as HTMLInputElement).value
        }
      })
        .then(data => {
          console.log(data);
          window.location.href = "/main";

          setError(typeError);
        })
        .catch(mutationError => {
          console.log(mutationError);
          setError(3);
        });
    } else {
      setError(typeError);
    }
  };
  const responseSuccessGoogle = (response: any) => {
    googleSignIn({
      variables: {
        tokenId: response.tokenId
      }
    })
      .then(data => {
        console.log(data);
      })
      .catch(mutationError => {
        setError(mutationError);
        console.log(mutationError);
        setError(4);
      });
  };
  const responseErrorGoogle = (responseError: any) => {
    console.log(`Error:${responseError}`);
  };
  const getErrorMsg = () => {
    let msg: string = "";
    switch (error) {
      default:
      case 1:
        msg = "The password must be ...";
        break;
      case 2:
        msg = "Bad email";
        break;
      case 3:
        msg = "This user already exists.";
        break;
      case 4:
        msg = "Not CW user";
    }
    return msg;
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
          <div className="Label-Error">{getErrorMsg()}</div>
        </div>
      ) : null}
      <div className="SignInBox">
        <h1 className="padding">Sign up</h1>
        <div className="SignIn-Row">
          <div>Name</div>
          <div className="Space">Lastname</div>
        </div>
        <div className="SignIn-Row">
          <input className="ShortInput" type="text" id="nameInput" />
          <input className="ShortInputMargin" type="text" id="lastnameInput" />
        </div>
        <div>Email</div>
        <input
          className="Input"
          type="text"
          id="emailInput"
          placeholder="my@company.com"
        />
        <div>Password</div>
        <input className="Input" type="password" id="pwdInput" />
        <button
          className="RegisterButton"
          type="button"
          onClick={() => buttonHandler()}
        >
          Sign up
        </button>
        <GoogleLogin
          className="GoogleLogin"
          clientId={process.env.REACT_APP_GOOGLE_TOKEN || ""}
          buttonText="Sign in with Google"
          onSuccess={responseSuccessGoogle}
          onFailure={responseErrorGoogle}
          cookiePolicy="single_host_origin"
        />
        <div className="SignIn-Row">
          <div>Already have an account?</div>
          <Link to="/sign-in">
            <a href="/sign-in" className="Color">
              {" "}
              Sign in
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;
