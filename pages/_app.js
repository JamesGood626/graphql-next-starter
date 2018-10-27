import React from "react";
import App, { Container } from "next/app";
import ApolloContainer from "../apollo";

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  componentDidMount = () => {
    console.log("App doing it's thing.");
  };

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <ApolloContainer>
          <Component {...pageProps} />
        </ApolloContainer>
      </Container>
    );
  }
}
