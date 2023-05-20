import { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import nftMarketplaceAbi from "../constants/NftMarketplace.json";
import nftAbi from "../constants/BasicNft.json";
import Image from "next/image";
import { Card, Etherscan, useNotification } from "web3uikit";
import { ethers } from "ethers";
import updateListingModal from "./UpdateListingModal";
const truncateStr = (fullStr, strLen) => {
  if (fullStr.length <= strLen) return fullStr;
  const seperator = "...";
  let seperatorLength = seperator.length;
  const charToShow = strLen - seperatorLength;
  const frontChar = Math.ceil(charToShow / 2);
  const backChar = Math.floor(charToShow / 2);
  return (
    fullStr.substring(0, frontChar) +
    seperator +
    fullStr.substring(fullStr.length - backChar)
  );
};
export default function NFTBox({
  price,
  nftAddress,
  tokenId,
  marketplaceAddress,
  seller,
}) {
  // hooks
  const { isWeb3Enabled, account } = useMoralis();
  const [imageURI, setImageURI] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const dispatch = useNotification();
  const hideModal = () => setShowModal(false);

  async function updateUI() {
    //get the tokenURI
    const tokenURI = await getTokenURI();
    console.log(`tokenURI: ${tokenURI}`);
    if (tokenURI) {
      //IPFS Gateway: A server that will return IPFS files from a "normal" URL.
      const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      const tokenURIResponse = await (await fetch(requestURL)).json();
      const imageURI = tokenURIResponse.image;
      const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      setImageURI(imageURIURL);
      setTokenName(tokenURIResponse.name);
      setTokenDescription(tokenURIResponse.description);
      // we could render the server
    }
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);
  const isOwnedByUser = seller === account || seller === undefined;
  const formatedSellerAddress = isOwnedByUser
    ? " you"
    : truncateStr(seller || " ", 15);
  const handleCardClick = () => {
    isOwnedByUser
      ? setShowModal(true)
      : buyItem({
          onError: (error) => console.log(error),
          onSuccess: () => handleBuyItemSuccess(),
        }); // Show the modal:buy Item
  };
  const handleBuyItemSuccess = () => {
    dispatch({
      type: "success",
      message: "Item bought!",
      title: "Item Bought",
      position: "topR",
    });
  };

  //********************************************************* */
  // calling contract functions
  const { runContractFunction: getTokenURI } = useWeb3Contract({
    abi: nftAbi,
    contractAddress: nftAddress,
    functionName: "tokenURI",
    params: {
      tokenId: tokenId,
    },
  });

  const { runContractFunction: buyItem } = useWeb3Contract({
    abi: nftMarketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "buyItem",
    msgValue: price,
    params: {
      nftAddress: nftAddress,
      tokenId: tokenId,
    },
  });
  /***********************************************************/
  return (
    <div>
      <div>
        {imageURI ? (
          <div>
            <updateListingModal
              isVisible={showModal}
              tokenId={tokenId}
              marketplaceAddress={marketplaceAddress}
              nftAddress={nftAddress}
              onClose={hideModal}
            />
            <Card
              title={tokenName}
              description={tokenDescription}
              onClick={handleCardClick}
            >
              <div className="flex felx-col items-end gap-3">
                <div>#{tokenId}</div>
                <div className="italic text-sm">
                  Owned by{formatedSellerAddress}
                </div>
                <Image
                  loader={() => imageURI}
                  src={imageURI}
                  height={"200"}
                  width={"100"}
                />
                <div>{ethers.utils.formatUnits(price, "ether")}ETH</div>
              </div>
            </Card>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}
