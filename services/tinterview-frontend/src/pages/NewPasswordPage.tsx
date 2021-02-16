import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";

require("dotenv").config();

const RESETPWD = gql`
  mutation($pwd: String!, $url: String!) {
    resetPwd(pwd: $pwd, url: $url)
  }
`;

const NewPasswordPage = () => {
  const [resetPwd] = useMutation(RESETPWD);
  const [error, setError] = useState<number | undefined>(undefined);

  const buttonHandler = () => {
    let typeError: number | undefined;
    const pwd2 = document.getElementById("pwdconfirmInput") as HTMLInputElement;
    const pwd = document.getElementById("pwdInput") as HTMLInputElement;
    const pwdRegex = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;
    if (pwd.value !== pwd2.value) {
      typeError = 2;
    }
    if (!pwdRegex.test(pwd.value) || !pwdRegex.test(pwd2.value)) {
      typeError = 1;
    }
    if (!typeError) {
      resetPwd({
        variables: {
          pwd: pwd.value,
          url: window.location.search
        }
      })
        .then(data => {
          const url = window.location.search.split("id=");
          const id = url[1];
          console.log(data);
          window.location.href = `/home?id=${id}`;
        })
        .catch(mutationError => {
          // console.error(mutationError);
          setError(mutationError);
        });
    } else {
      setError(typeError);
    }
  };
  const getErrorMsg = () => {
    let msg: string = "";
    switch (error) {
      default:
      case 1:
        msg = "The password must be ...";
        break;
      case 2:
        msg = "Paswords don't match";
        break;
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
        <h1 className="padding">Reset your password</h1>
        <div className="SignIn-column">
          <input
            className="Input"
            type="password"
            id="pwdInput"
            placeholder="New password"
          />
          <input
            className="Input"
            type="password"
            id="pwdconfirmInput"
            placeholder="Confirm new password"
          />
        </div>
        <button
          className="RegisterButton"
          type="button"
          onClick={() => buttonHandler()}
        >
          Change my password
        </button>
      </div>
      <div className="SignInBox">
        <div className="SignIn-column">
          <div className="SignIn-Row">
            <b>Found your password? </b>
            <a href="/sign-in" className="Color">
              {" "}
              Log in
            </a>
          </div>
          <div className="SignIn-Row">
            <b>Dont have an account yet?</b>
            <a href="/sign-up" className="Color">
              {" "}
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPasswordPage;
