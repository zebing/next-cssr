import Document, { Head, Main, NextScript } from 'next/document';
import React from 'react';
// eslint-disable-next-line import/no-unresolved

export default class MyDocument extends Document {
  render() {
    const html = this.props;
    return (
      <html>
        <Head>
          <title>My page</title>
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}