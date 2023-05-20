import { Form, useNotification } from "web3uikit";
import nftMarketplaceAbi from "../constants/NftMarketplace.json";
import nftAbi from "../constants/BasicNft.json";
import { useMoralis, useWeb3Contract } from "react-moralis";
import networkMapping from "../constants/networkMapping.json";
import { useWeb3Contract } from "react-moralis";
import { ethers } from "ethers";
export default function Home() {
  const { chainId } = useMoralis();
  const chainString = chainId ? parseInt(chainId).toString() : "";
  const marketplaceAddress = networkMapping[chainString].nftMarketplace[0];
  const dispatch = useNotification();
  const { runContractFunction } = useWeb3Contract();
  async function approveAndList(data) {
    console.log("Approving...");
    const nftAddress = data.data[0].inputResult;
    const tokenId = data.data[1].inputResult;
    const price = ethers.utils
      .parseUnits(data.data[2].inputResult, "ether")
      .toString();
    const approveOptions = {
      abi: nftAbi,
      contractAddress: nftAddress,
      function: "approve",
      params: {
        to: marketplaceAddress,
        tokenId: tokenId,
      },
    };
    await runContractFunction({
      params: approveOptions,
      onSuccess: handleApproveSuccess(nftAddress, tokenId, price),
      onError: (error) => {
        console.log(error);
      },
    });
  }
  async function handleApproveSuccess(nftAddress, tokneId, price) {
    console.log("Ok! Now time to list");
    const listOptions = {
      abi: nftMarketplaceAbi,
      contractAddress: marketplaceAddress,
      function: "listItem",
      params: {
        nftAddress: nftAddress,
        tokenId: tokenId,
        price: price,
      },
    };
    await runContractFunction({
      params: listOptions,
      onSuccess: () => handleListSuccess(),
      onError: (error) => console.log(error),
    });
  }
  async function handleListSuccess() {
    dispatch({
      type: "success",
      message: "NFt listing",
      title: "NFT listed",
      position: "topR",
    });
  }
  return (
    <div>
      <Form
        onSubmit={approveAndList}
        data={[
          {
            name: "NFT Address",
            type: "text",
            inputWidth: "50%",
            value: "",
            key: "nftAddress",
          },
          {
            name: "Token ID",
            type: "number",
            value: "",
            key: "tokenId",
          },
          {
            name: "Price (in ETH)",
            type: "number",
            value: "",
            key: "price",
          },
        ]}
        title="Sell you NFT!"
        if="Main Form"
      />
    </div>
  );
}
