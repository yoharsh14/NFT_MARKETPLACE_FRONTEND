import { useEffect, useState } from "react";
import { createClient } from "urql";

export default function Graph() {
  const QueryURL =
    "https://api.studio.thegraph.com/query/46444/nft_marketplacev2/v0.1";
  const query = `itemListeds (first: 5){
    id
    seller
    nftAddress
    tokenId
    price
  }`;
  const client = createClient({
    url: QueryURL,
  });
  const [data, setData] = useState();
  useEffect(() => {
    const getTokens = async () => {
      const { data } = await client.query(query).toPromise();
      setData(data);
    };
    getTokens();
  }, []);
  return (
    <div>
      <div>
        {data.itemsListeds.map((nft) => {
          const { price, nftAddress, tokenId, seller } = nft;
          return (
            <div>
              Price:{price}, nftAddress{nftAddress}, tokenId{tokenId}, seller
              {seller}
            </div>
          );
        })}
      </div>
    </div>
  );
}
