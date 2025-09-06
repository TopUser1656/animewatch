import '../styles/globals.css'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="google-site-verification" content="<meta name="google-site-verification" content="RC4Xk22aBjjXN2iS0D1HyUA_Yjrbcm7mUdBsGh5qEtk" />" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
