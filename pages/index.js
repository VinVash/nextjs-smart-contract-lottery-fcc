import Head from 'next/head'
import styles from '../styles/Home.module.css'

// import ManualHeader from '../components/ManualHeader.component'
import Header from "../components/Header.component"
import LotteryEntrance from "../components/LotteryEntrance.component"

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Smart Contract Lottery</title>
        <meta name="description" content='Our Smart contract lottery' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Header />
      <LotteryEntrance />

    </div>
  )
}
