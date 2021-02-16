import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink
} from "@apollo/client";
import App from "./App";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createHttpLink({
    uri: "http://localhost:4000/api"
  })
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
