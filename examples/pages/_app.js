import App, { Container } from 'next/app';
import React from 'react';
import 'antd/dist/antd.css';
// @import "../../../node_modules/antd/dist/antd.less";

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    return <Container>
      <div>ksbdksdvb</div>
      <Component {...pageProps} />
    </Container>;
  }
}