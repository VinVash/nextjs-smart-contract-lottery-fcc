import '../styles/globals.css';
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";

// initializeOnMount -> hook into a server to add more features to the website.

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider initializeOnMount={false}>
    	<NotificationProvider>
      		<Component {...pageProps} />
      	</NotificationProvider>
    </MoralisProvider>
  )
}

export default MyApp;
