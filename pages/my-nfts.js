import Web3 from "web3";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

import Marketplace from "../backend/build/contracts/Marketplace.json";
import NFT from "../backend/build/contracts/NFT.json";

const MyStems = () => {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const router = useRouter();

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const web3 = new Web3(window.ethereum);
    const networkId = await web3.eth.net.getId();
    const marketPlaceContract = new web3.eth.Contract(
      Marketplace.abi,
      Marketplace.networks[networkId].address
    );
    const NFTContractAddress = NFT.networks[networkId].address;
    const NFTContract = new web3.eth.Contract(NFT.abi, NFTContractAddress);
    const accounts = await web3.eth.getAccounts();
    const data = await marketPlaceContract.methods
      .getMyNfts()
      .call({ from: accounts[0] });

    const nfts = await Promise.all(
      data.map(async (i) => {
        try {
          const tokenURI = await NFTContract.methods.tokenURI(i.tokenId).call();
          const meta = await axios.get(tokenURI);
          let nft = {
            price: i.price,
            supply: i.supply,
            tokenId: i.tokenId,
            seller: i.seller,
            owner: i.buyer,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,

            tokenURI: tokenURI,
          };
          return nft;
        } catch (err) {
          console.log(err);
          return null;
        }
      })
    );
    setNfts(nfts.filter((nft) => nft !== null));
    setLoadingState("loaded");
  }

  function listNFT(nft) {
    router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`);
  }

  return (
    <div>
      <div className="flex justify-center items-center mb-4 mt-4">
        <div className="text-4xl font-bold text-center">My Owned Stems</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4 pt-4  w-full  py-6 px-6">
        {nfts.map((nft, i) => (
          <div
            key={i}
            className="border-[2px] border-black shadow overflow-hidden hover:scale-[1.03] transform transition duration-500 ease-in-out mb-4"
          >
            <figure className="flex items-center justify-center  w-full">
              <audio
                controls
                controlsList="nodownload"
                className="w-full border-b-[2px] border-black"
              >
                <source src={nft.image} type="audio/mpeg" />
              </audio>
            </figure>

            <div className="p-4 space-y-2">
              <p className="text-2xl font-semibold">{nft.name}</p>

              <p className="">
                <span className="font-semibold">Description: </span>
                {nft.description}
              </p>
              <p>
                {/* Uploaded by: {nft.seller.slice(0, 5)}...
                      {nft.seller.slice(-4)} */}
                <span className="font-semibold">Uploaded by: </span>
                {nft.seller.slice(0, 5)}...
                {nft.seller.slice(-4)}
              </p>
              <p className="space-x-2">
                <span className="badge">genre</span>
                <span className="badge">instrument</span>
              </p>
            </div>

            {/* <div className="stats shadow border-t-[2px] border-black w-full rounded-none">
                    <div className="stat place-items-center border-r-[2px] border-black">
                      <div className=" font-bold">Price</div>
                      <div className="stat-value">
                        {Web3.utils.fromWei(nft.price, "ether")}
                      </div>
                      <div className=" font-bold text-black">MATIC</div>
                    </div>
                    <div className="stat place-items-center">
                      <div className="font-bold">Supply</div>
                      <div className="stat-value text-secondary">
                        {nft.supply}
                      </div>
                      <div className="font-bold">LEFT</div>
                    </div>
                    <div className="stat place-items-center border-l-[2px] border-black">
                      <div className="font-bold">Royalty Share</div>
                      <div className="stat-value">{nft.royalty}%</div>
                      <div className="font-bold">PERCENT</div>
                    </div>
                  </div> */}
            {/* do the code above but fix the border issue with the one next to royalty share not being 2px */}
            <div className="stats shadow border-t-[2px] border-black w-full rounded-none">
              <div className="stat place-items-center border-r-[2px] border-black">
                <div className=" font-bold">Price</div>
                <div className="stat-value">
                  {Web3.utils.fromWei(nft.price, "ether")}
                </div>
                <div className=" font-bold text-black">MATIC</div>
              </div>

              <div className="stat place-items-center">
                <div className="font-bold">Supply</div>
                <div className="stat-value text-secondary">{nft.supply}</div>
                <div className="font-bold">LEFT</div>
              </div>

              <div className="stat place-items-center border-l-[2px] border-black">
                <div className="font-bold">Royalty</div>
                <div className="stat-value">{nft.royalty}%</div>
                <div className="font-bold">PERCENT</div>
              </div>
            </div>

            <div className="p-4 border-t-[2px] border-black">
              <a
                onClick={() => listNFT(nft)}
                className="relative inline-block px-4 py-2  group w-full cursor-pointer  text-center"
              >
                <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-[#6AB313] group-hover:-translate-x-0 group-hover:-translate-y-0 border-black border-[2px]"></span>
                <span className="absolute inset-0 w-full h-full bg-white border-[2px] border-black group-hover:bg-[#6AB313]"></span>

                <span className="relative text-black group-hover:text-black ">
                  Resell Stem
                </span>
              </a>
              <div className="flex gap-2 text-center mt-4">
                <a className="relative inline-block px-4 py-2  group w-full text-center items-center justify-center cursor-pointer">
                  <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-[#ffc900] group-hover:-translate-x-0 group-hover:-translate-y-0 border-black border-[2px]"></span>
                  <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-[#ffc900]"></span>
                  <span className="relative text-black group-hover:text-black ">
                    Tip Creator
                  </span>
                </a>
                <a
                  href="/marketplace"
                  className="relative inline-block px-4 py-2  group w-full text-center items-center justify-center"
                >
                  <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-[#ff90e8] group-hover:-translate-x-0 group-hover:-translate-y-0 border-black border-[2px]"></span>
                  <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-[#ff90e8]"></span>
                  <span className="relative text-black group-hover:text-black ">
                    Report
                  </span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyStems;
