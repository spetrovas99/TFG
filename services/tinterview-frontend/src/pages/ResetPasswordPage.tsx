import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";

require("dotenv").config();

const SENDEMAILPWD = gql`
  mutation($email: String!) {
    sendEmailPwd(email: $email)
  }
`;

const ResetPasswordPage = () => {
  const [sendEmailPwd] = useMutation(SENDEMAILPWD);
  const [error, setError] = useState<number | undefined>(undefined);

  const buttonHandler = () => {
    sendEmailPwd({
      variables: {
        email: (document.getElementById("emailInput")! as HTMLInputElement)
          .value
      }
    })
      .then(data => {
        console.log(data);
        // window.location.href = "/recruiter";
        setError(2);
      })
      .catch(mutationError => {
        console.error(mutationError);
        setError(1);
      });
  };
  const getErrorMsg = () => {
    let msg: string = "";
    switch (error) {
      default:
      case 1:
        msg = "Please enter a valid email adress.";
        break;
      case 2:
        msg =
          "If user with this e-mail address exists, you will receive an email with instructions about how to reset your password in a few minutes.";
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
          <div>Email</div>
          <input
            className="Input"
            type="text"
            id="emailInput"
            placeholder="my@company.com"
          />
        </div>
        <button
          className="RegisterButton"
          type="button"
          onClick={() => buttonHandler()}
        >
          Send reset instructions
        </button>
      </div>
      <div className="SignInBox">
        <div className="SignIn-column">
          <div className="SignIn-Row">
            <b>Found your password? </b>
            <Link to="/sign-in">
              <a href="/sign-in" className="Color">
                {" "}
                Log in
              </a>
            </Link>
          </div>
          <div className="SignIn-Row">
            <b>Dont have an account yet?</b>
            <Link to="/sign-up">
              <a href="/sign-up" className="Color">
                {" "}
                Sign up
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
