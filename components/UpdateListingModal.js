import { useState } from "react";
import { Modal, Input, useNotification } from "web3uikit";
import { useWeb3Contract } from "react-moralis";
import nftMarketplaceAbi from "../constants/NftMarketplace.json";
import { ethers } from "ethers";
export default function updateListingModal({
  nftAddress,
  tokenId,
  marketplaceAddress,
  onClose,
}) {
  const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState(0);
  const { runContractFunction: updateListing } = useWeb3Contract({
    abi: nftMarketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "updateListing",
    params: {
      nftAddress: nftAddress,
      tokenId: tokenId,
      newPrice: ethers.utils.parseEther(priceToUpdateListingWith || "0"),
    },
  });
  const handleUpdateListingSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "listing update",
      title: "Listing update - please refresh (and move blocks)",
      position: "topR",
    });
  };
 
  console.log(priceToUpdateListingWith);
  return (
    <Modal
      isVisible={isVisible}
      onCancel={onClose}
      onCloseButtonPressed={onClose}
      onOk={() => {
        updateListing({
          onError: (error) => {
            console.log(error);
          },
          onSuccess:handleUpdateListingSuccess,
        });
      }}
    >
      <Input
        label="Update listing price in L1 Currency (ETH)"
        name="New Listing price"
        type="number"
        onChange={(event) => {
          setPriceToUpdateListingWith(event.target.value);
        }}
        onOk={() => {}}
      />
    </Modal>
  );
}āṭ