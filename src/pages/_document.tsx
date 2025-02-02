import Document, { Html, Head, Main, NextScript } from 'next/document'

class BlogDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }
  render() {
    return (
      <Html>
        <Head>
          <meta name="description" content="개발자 기록" />
          <meta name="theme-color" content="#000000" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content"
          />
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link rel="manifest" href="/manifest.json" />
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@350;400&display=swap"
            rel="stylesheet"
            crossOrigin="anonymous"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default BlogDocument
