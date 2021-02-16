import React from "react";
import { Switch, Route } from "react-router";
import SignInPage from "./pages/SignIn.tsx";
import SignUpPage from "./pages/SignUp.tsx";
import Principal from "./pages/Principal.tsx";
import Home from "./pages/HomePage.tsx";
import ResetPassword from "./pages/ResetPasswordPage.tsx";
import NewPassword from "./pages/NewPasswordPage.tsx";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Principal} />
        <Route exact path="/sign-up" component={SignUpPage} />
        <Route exact path="/sign-in" component={SignInPage} />
        <Route exact path="/reset-password" component={ResetPassword} />
        <Route exact path="/new-password" component={NewPassword} />
        <Route exact path="/home" component={Home} />
      </Switch>
    </div>
  );
};

export default App;
