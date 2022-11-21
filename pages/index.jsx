import getConfig from "next/config";
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { NFTCard } from "./components/nftCard";

const Home = () => {
  console.log("ENTRY");
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [fetchForCollection, setFetchForCollection] = useState(false);

  console.log("GETTING CONFIG");
  console.log(serverRuntimeConfig.mySecret); // Will only be available on the server side
  console.log(publicRuntimeConfig.staticFolder); // Will be available on both server and client
  const api_key = publicRuntimeConfig.API_KEY;
  //console.log(api_key);
  console.log("RETRIEVED CONFIG");

  const fetchNFTs = async () => {
    // Get all NFT's and filter by collection
    let nfts;
    console.log("Fetching nfts");

    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTs/`;
    if (!collection.length) {
      // No collection
      var requestOptions = {
        method: "GET",
      };

      const fetchURL = `${baseURL}?owner=${wallet}`;
      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
    } else {
      // filter by collection
      console.log("fetching nfts for collection owned by address");
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
      console.log("done fetching for collection owned by address");
    }
    if (nfts) {
      console.log("NFTs:  ", nfts);
      setNFTs(nfts.ownedNfts);
    } else {
      console.log("NO NFTS");
    }
  };

  const fetchNFTsForCollection = async () => {
    console.log("Fetching nfts for collection");
    if (collection.length) {
      var requestOptions = {
        method: "GET",
      };
      const api_key = "SdaynPyfQPNCFF_4YrqaZTyasiKhq-bd";
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`;

      const nfts = await fetch(fetchURL, requestOptions).then((data) =>
        data.json()
      );
      console.log("done fetching for collection by contract address");

      if (nfts) {
        console.log("NFTs:  ", nfts);
        setNFTs(nfts.nfts);
      } else {
        console.log("NO NFTS");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input
          disabled={fetchForCollection}
          className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50"
          onChange={(e) => {
            setWalletAddress(e.target.value);
          }}
          value={wallet}
          type={"text"}
          placeholder="Add your wallet address"
        ></input>
        <input
          className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-200 disabled:text-gray-50"
          onChange={(e) => {
            setCollectionAddress(e.target.value);
          }}
          value={collection}
          type={"text"}
          placeholder="Add the collection address"
        ></input>
        <label className="text-gray-600">
          <input
            onChange={(e) => {
              setFetchForCollection(e.target.checked);
            }}
            type={"checkbox"}
            className="mr-2"
          ></input>
          Fetch for collection
        </label>
        <button
          className="disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"
          onClick={() => {
            if (fetchForCollection) {
              fetchNFTsForCollection();
            } else fetchNFTs();
          }}
        >
          Let's go!
        </button>
      </div>
      <div className="flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center">
        {NFTs.length &&
          NFTs.map((nft) => {
            return <NFTCard nft={nft}></NFTCard>;
          })}
        ;
      </div>
    </div>
  );
};

export default Home;
