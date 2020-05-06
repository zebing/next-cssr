import Document, { Head, Main, NextScript } from 'next/document';
import React from 'react';
import { requestOnDowngrade, useRem } from '../../../lib';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps, prefetchAPIConfig: ctx.prefetchAPIConfig };
  }

  render() {
    const { html, prefetchAPIConfig } = this.props;
    return (
      <html>
        <Head>
          {this.props.styleTags}
          <script dangerouslySetInnerHTML={{ __html: requestOnDowngrade(prefetchAPIConfig) }}></script>
          <script dangerouslySetInnerHTML={{ __html: useRem() }}></script>
        </Head>
        <body>
          <Main />
          <NextScript />
          <script src="/static/test.js"></script>
        </body>
      </html>
    );
  }
}