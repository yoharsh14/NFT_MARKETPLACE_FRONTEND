import { useQuery, gql } from "@apollo/client";

const GET_ACTIVE_ITEMS = gql`
  {
    activeItems(first: 5) {
      id
      buyer
      seller
      nftAddress
      tokenId
      price
    }
  }
`;
export default function Graph() {
  const { loading, error, data } = useQuery(GET_ACTIVE_ITEMS);
  console.log({ data });
  return (<div>
    <div>{data.activeItems.map((nft)=>{
      const {price, nftAddress, tokenId, seller} = nft;
     return <div>Price:{price}, nftAddress{nftAddress}, tokenId{tokenId}, seller{seller}</div>
    })}</div>
  </div>);
}
