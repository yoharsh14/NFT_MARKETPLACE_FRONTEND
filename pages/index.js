import { useMoralis } from "react-moralis";
import NFTBox from "../components/NFTBox";
import networkMapping from "../constants/networkMapping.json";
import { createClient } from "urql";
import { Fragment, useEffect, useState } from "react";
export default function Home() {
  const { chainId, isWeb3Enabled } = useMoralis();
  const chainString = chainId ? parseInt(chainId).toString() : null;
  const marketplaceAddress = chainId
    ? networkMapping[chainString]["NftMarketplace"][0]
    : null;
  const QueryURL =
    "https://api.studio.thegraph.com/query/46444/nft_marketplacev2/v0.1";
  const query = `{itemListeds (first: 5){
    id
    seller
    nftAddress
    tokenId
    price
  }}`;
  const client = createClient({
    url: QueryURL,
  });
  const [listedNft, setListedNft] = useState();
  const [loading, setLoading] = useState();
  useEffect(() => {
    setLoading(true);
    const getTokens = async () => {
      const { data } = await client.query(query).toPromise();
      setListedNft(data);
      setLoading(false);
      console.log(data);
    };
    getTokens();
  }, []);
  return (
    <Fragment>
      <h1 className="py-3 px-4 font-bold text-4xl text-center">
        Recently Listed
      </h1>
      <div className="m-10 p-3 text-[#3AA6B9]">
        <div className="flex flex-wrap gap-3">
          {isWeb3Enabled && chainId ? (
            loading || !listedNft ? (
              <div>Loading...</div>
            ) : (
              listedNft.itemListeds.map((nft) => {
                const { price, nftAddress, tokenId, seller } = nft;
                return marketplaceAddress ? (
                  <NFTBox
                    price={price}
                    nftAddress={nftAddress}
                    tokenId={tokenId}
                    marketplaceAddress={marketplaceAddress}
                    seller={seller}
                    key={`${nftAddress}${tokenId}`}
                  />
                ) : (
                  <div>
                    Network error, please switch to a supported network.{" "}
                  </div>
                );
              })
            )
          ) : (
            <div>Web3 Currently Not Enabled</div>
          )}
        </div>
      </div>
    </Fragment>
  );
}
