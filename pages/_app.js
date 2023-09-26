import "@/styles/globals.css";
import { MoralisProvider } from "react-moralis";
import Header from "../components/Header";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { NotificationProvider } from "web3uikit";
import { Fragment } from "react";
const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: process.env.NEXT_PUBLIC_URI,
});

export default function App({ Component, pageProps }) {
  return (
    <Fragment>
      <div className="text-[#3AA6B9]">
        <div className="h-[30px] bg-blue-200 text-green-500 text-center font-semibold text-xl">
          Connect to Polygon mumbai TestNet
        </div>
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
    </Fragment>
  );
}
