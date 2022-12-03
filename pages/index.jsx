import getConfig from "next/config";
import React, { Component } from "react";
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

import { CopyToClipboard } from "react-copy-to-clipboard";

import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import { NFTCard } from "./components/nftCard";

const Home = () => {
  console.log("ENTRY");
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [pageCount, setPageCount] = useState();
  const [hasMorePages, setHasMorePages] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const [pageKey, setPageKey] = useState([]);
  const [myMap, setMyMap] = useState(new Map());
  const updateMap = (k, v) => {
    setMyMap(new Map(myMap.set(k, v)));
  };
  const [fetchForCollection, setFetchForCollection] = useState(false);

  const pageSize = 25;
  var previousPageKey = "";
  var activeCurrentPage = 1;

  console.log("GETTING CONFIG");
  const api_key = publicRuntimeConfig.API_KEY;
  console.log("RETRIEVED CONFIG");

  const fetchNFTs = async (inPageKey) => {
    // Get all NFT's and filter by collection
    let nfts;
    console.log("Fetching nfts");

    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTs/`;
    var activePageKey;
    var activeCurrentPage = 0;

    if (!collection.length) {
      // No collection
      var requestOptions = {
        method: "GET",
      };
      var fetchURL = `${baseURL}?owner=${wallet}&pageSize=${pageSize}`;
      console.log("fetchNFTs PAGEKEY:  ", pageKey);

      //if (pageKey === undefined) {
      if (currentPage == 0) {
        //|| !pageKey.length) {
        // if (!pageKey.length) {
        console.log("fetchNFTs - Getting NFT's without a page key");
        fetchURL = `${baseURL}?owner=${wallet}&pageSize=${pageSize}`;
        setCurrentPage(currentPage + 1);
        console.log("fetchNFTs - currentPageCount:  ", currentPage);
        console.log("fetchNFTs - fetchURL:  ", fetchURL);
      } else {
        if (previousPageKey === undefined) {
          previousPageKey = "";
          activeCurrentPage = 1;
        } else {
          if (currentPage == 1 || !previousPageKey.length) {
            activePageKey = pageKey;
            activeCurrentPage = currentPage + 1;
          } else {
            console.log("fetchNFTs - Getting NFT's using previous page key");
            console.log("fetchNFTs - previousPageKey", previousPageKey);
            activePageKey = previousPageKey;
            previousPageKey = "";
            activeCurrentPage = currentPage - 1;
          }
        }
        console.log("fetchNFTs - Getting NFT's. currentPage:    ", currentPage);
        console.log(
          "fetchNFTs - Getting NFT's using activePageKey:  ",
          activePageKey
        );
        console.log(
          "fetchNFTs - Getting NFT's using activeCurrentPage:  ",
          activeCurrentPage
        );
        fetchURL = `${baseURL}?owner=${wallet}&pageSize=${pageSize}&pageKey=${activePageKey}`;
        setCurrentPage(activeCurrentPage);
        //console.log("fetchNFTs - fetchURL:  ", fetchURL);
      }

      //const fetchURL = `${baseURL}?owner=${wallet}&pageSize=${pageSize}`;
      //var params = {page: 'xxx', pageSize: 25}
      var queryParams = new URLSearchParams({
        pageSize: 25,
      });
      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
      // console.log("fetchNFTs - retrieved pagekey:  ", nfts.pageKey);
    } else {
      // filter by collection
      console.log("fetchNFTs - fetching nfts for collection owned by address");
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
      console.log("fetchNFTs - done fetching for collection owned by address");
    }
    if (nfts) {
      var totalCount = nfts.totalCount;
      setPageCount(Math.ceil(totalCount / pageSize));
      setPageKey(nfts.pageKey);
      updateMap(activeCurrentPage, activePageKey);
      if (currentPage + 1 >= pageCount) {
        setHasMorePages(false);
      } else {
        setHasMorePages(true);
      }

      setNFTs(nfts.ownedNfts);
    } else {
      console.log("fetchNFTs - NO NFTS");
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

  const inputComponents = getInputComponents();
  const paginationComponents = getPaginationComponents();
  const nftCards = getNftCardComponents();

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      {inputComponents}
      {paginationComponents}
      {nftCards}
    </div>
  );

  function getInputComponents() {
    return (
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
            } else {
              fetchNFTs();
              console.log("getInputComponents pageCount:  ", pageCount);
            }
          }}
        >
          Let's go!
        </button>
      </div>
    );
  }

  function getPaginationComponents() {
    console.log("getPaginationComponents ENTRY - pageCount:  ", pageCount);
    if (pageCount > 0) {
      console.log("getPaginationComponents - currentPage:  ", currentPage);
      if (currentPage <= pageCount) {
        if (!hasMorePages && currentPage < pageCount) {
          console.log("getPaginationComponents - !hasMorePages");
          setHasMorePages(true);
        }
        console.log(
          "getPaginationComponents - hasMorePages value:  ",
          hasMorePages
        );

        return (
          <div
            div
            className="flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center"
          >
            <div className="flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center">
              <button
                className="disabled:bg-slate-500 text-white bg-blue-400 px-3 py-2 mt-3 rounded-md w-1/5"
                disabled={currentPage == 1 ? true : false}
                onClick={() => {
                  console.log(
                    "getPaginationComponents - onClick (previous):  ",
                    currentPage
                  );
                  var newPageKey = undefined;
                  if (pageCount >= currentPage) {
                    var newCurrentPage = 1;
                    setCurrentPage(currentPage - 1);
                    if (currentPage == 2) {
                      console.log(
                        "getPaginationComponents - GOING BACK TO PAGE 1"
                      );
                      newPageKey = undefined;
                    } else {
                      newPageKey = myMap.get(currentPage - 1);
                    }
                    newCurrentPage = currentPage - 1;

                    console.log(
                      "getPaginationComponents - previous Pagekey to retrieve:  ",
                      newPageKey
                    );
                    console.log(
                      "getPaginationComponents - previous page number to retrieve:  ",
                      newCurrentPage
                    );
                    //setPageKey(newPageKey);
                    //setCurrentPage(newCurrentPage);
                    activeCurrentPage = newCurrentPage;

                    previousPageKey = newPageKey;
                    fetchNFTs();
                  }
                }}
              >
                Previous Page
              </button>
              <button
                className="disabled:bg-slate-500 text-white bg-blue-400 px-3 py-2 mt-3 rounded-lg w-1/5"
                disabled={hasMorePages ? false : true}
                onClick={() => {
                  if (pageCount > currentPage) {
                    fetchNFTs();
                  }
                }}
              >
                NextPage
              </button>
            </div>
            <div className="flex flex-wrap pt-0 w-5/6 py-0 justify-center">
              <label className="text-gray-600 pt-0">
                Current Page: {currentPage}{" "}
              </label>
            </div>
          </div>
        );
      } else {
        setPageKey([]);
        setPageCount(0);
        setCurrentPage(1);

        setHasMorePages(false);
        return (
          <div className="bold text-blue text-4xl">
            {" "}
            You have viewed all of the NFT's
          </div>
        );
      }
    } else {
      console.log("getPaginationComponents - currentPage >= pageCount");
      return <div>We don't have any pages yet</div>;
    }
  }

  function getNftCardComponents() {
    if (NFTs.length > 0) {
      return (
        <div className="flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center">
          {NFTs.length &&
            NFTs.map((nft) => {
              return <NFTCard nft={nft}></NFTCard>;
            })}
        </div>
      );
    } else {
      return (
        <div>
          <label>We don't have any data</label>
        </div>
      );
    }
  }
};

export default Home;
