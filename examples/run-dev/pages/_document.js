import Document, { Head, Main, NextScript } from 'next/document';
import React from 'react';
import { requestOnDowngrade } from '../../../dist/lib';
// eslint-disable-next-line import/no-unresolved

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    let pageInitialProps = {};
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps, prefetchAPIConfig: ctx.prefetchAPIConfig };
  }

  render() {
    const { html, prefetchAPIConfig } = this.props;
    return (
      <html>
        <Head>
          <title>My page</title>
          {this.props.styleTags}
          <script dangerouslySetInnerHTML={{ __html: requestOnDowngrade(prefetchAPIConfig) }}></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}