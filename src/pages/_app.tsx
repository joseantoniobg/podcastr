import '../styles/global.scss';

import { Header } from '../components/Header';
import { Player } from '../components/Player';
import Head from 'next/head';

import styles from '../styles/app.module.scss';
import { PlayerContextProvider } from '../contexts/PlayerContext';

function MyApp({ Component, pageProps }) {

 return (
   <PlayerContextProvider>
     <Head>
        <title>Home | Podcastr</title>
     </Head>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContextProvider>);
}

export default MyApp;
