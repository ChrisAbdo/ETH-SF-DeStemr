import { useEffect, useState } from "react";
import Web3 from "web3";
import { useRouter } from "next/router";
import axios from "axios";
import toast from "react-hot-toast";

import Marketplace from "../backend/build/contracts/Marketplace.json";
import NFT from "../backend/build/contracts/NFT.json";

const ResellNFT = () => {
  const [formInput, updateFormInput] = useState({
    price: "",
    image: "",
    royalty: "",
    supply: "",
  });
  const router = useRouter();
  const { id, tokenURI } = router.query;
  const { image, price, royalty, supply } = formInput;

  useEffect(() => {
    fetchNFT();
  }, [id]);

  async function fetchNFT() {
    if (!tokenURI) {
      return;
    } else {
      const meta = await axios.get(tokenURI);
      updateFormInput((state) => ({ ...state, image: meta.data.image }));
    }
  }

  async function listNFTForSale() {
    if (!price) {
      return;
    } else {
      const notification = toast.loading("Listing NFT for sale...");

      try {
        const web3 = new Web3(window.ethereum);
        const networkId = await web3.eth.net.getId();
        const marketPlaceContract = new web3.eth.Contract(
          Marketplace.abi,
          Marketplace.networks[networkId].address
        );
        let listingFee = await marketPlaceContract.methods
          .getListingFee()
          .call();
        listingFee = listingFee.toString();
        const accounts = await web3.eth.getAccounts();
        marketPlaceContract.methods
          .resellNft(
            NFT.networks[networkId].address,
            id,
            Web3.utils.toWei(formInput.price, "ether"),
            formInput.royalty,
            formInput.supply
          )
          .send({ from: accounts[0], value: listingFee })
          .on("receipt", function () {
            console.log("listed");
            toast.success("NFT listed for sale!", {
              id: notification,
            });
            router.push("/marketplace");
          });
      } catch (err) {
        console.log(err);
        toast.error("Error listing NFT for sale", {
          id: notification,
        });
      }
    }
  }
  return (
    <div>
      <div className="card flex-shrink-0 w-full shadow-2xl bg-base-100 border-black border-[2px]">
        <div className="card-body">
          <div className="flex flex-col items-center justify-center">
            <figure>
              {image && <audio className="rounded mt-4" src={image} />}
            </figure>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Supply</span>
            </label>
            <input
              type="number"
              placeholder="Stem Supply"
              className="input border-black"
              onChange={(e) =>
                updateFormInput({ ...formInput, supply: e.target.value })
              }
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Royalty Split %</span>
            </label>
            <input
              type="number"
              placeholder="Stem Royalty Split %"
              className="input border-black"
              onChange={(e) =>
                updateFormInput({ ...formInput, royalty: e.target.value })
              }
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Price</span>
            </label>

            <label className="input-group">
              <input
                type="text"
                placeholder="0.01"
                className="input border-black w-full"
                onChange={(e) =>
                  updateFormInput({ ...formInput, price: e.target.value })
                }
              />
              <span className="border-black border-t border-r border-b">
                MATIC
              </span>
            </label>
          </div>
          <div className="form-control mt-6">
            <div
              onClick={listNFTForSale}
              className="relative inline-block px-4 py-2  group cursor-pointer"
            >
              <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-[#6AB313] group-hover:-translate-x-0 group-hover:-translate-y-0 border-black border-[2px]"></span>
              <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-[#6AB313]"></span>
              <span className="relative text-black group-hover:text-black text-center flex flex-col">
                Create Stem
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResellNFT;
