import "@/styles/globals.css";
import { MoralisProvider } from "react-moralis";
import Header from "../components/Header";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { NotificationProvider } from "web3uikit";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: process.env.NEXT_PUBLIC_URI,
});

export default function App({ Component, pageProps }) {
  return (
    <div>
      <title>NFT Market Place</title>
      <meta name="description" content="NFT Marketplace" />
      <link rel="icon" href="/favicon.ico" />
      <MoralisProvider initializeOnMount={false}>
        <ApolloProvider client={client}>
          <NotificationProvider>
            <Header />
            <Component {...pageProps} />
          </NotificationProvider>
        </ApolloProvider>
      </MoralisProvider>
    </div>
  );
}
