import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import toast from "react-hot-toast";
import axios from "axios";

import Web3 from "web3";
import Marketplace from "../backend/build/contracts/Marketplace.json";
import NFT from "../backend/build/contracts/NFT.json";

const createItem = () => {
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(true);
  const [web3, setWeb3] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    supply: "",
    royalty: "",
    name: "",
    description: "",
  });
  const router = useRouter();

  useEffect(() => {
    loadBlockchainData();
  }, [account]);

  const ipfsClient = require("ipfs-http-client");
  const projectId = "2FdliMGfWHQCzVYTtFlGQsknZvb";
  const projectSecret = "2274a79139ff6fdb2f016d12f713dca1";
  const auth =
    "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
  const client = ipfsClient.create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
    },
  });

  const loadBlockchainData = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  async function onChange(e) {
    // upload image to IPFS
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.io/ipfs/${added.path}`;
      console.log(url);
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function uploadToIPFS() {
    const { name, description, price, supply, royalty } = formInput;
    if (!name || !description || !price || !supply || !royalty || !fileUrl) {
      return;
    } else {
      // first, upload metadata to IPFS
      const data = JSON.stringify({
        name,
        description,
        image: fileUrl,
      });
      try {
        const added = await client.add(data);
        const url = `https://ipfs.io/ipfs/${added.path}`;
        // after metadata is uploaded to IPFS, return the URL to use it in the transaction
        return url;
      } catch (error) {
        console.log("Error uploading file: ", error);
      }
    }
  }

  async function listNFTForSale() {
    // const notification = toast.loading(
    //   "Make sure to confirm both transactions!"
    // );
    // custom toast notification with black border 2px
    const notification = toast.loading(
      "Make sure to confirm both transactions!",
      {
        style: {
          border: "2px solid #000",
          // make bold
          fontWeight: "bold",
        },
      }
    );

    try {
      // const web3Modal = new Web3Modal();
      // const provider = await web3Modal.connect();
      // const web3 = new Web3(provider);
      // const url = await uploadToIPFS();
      // const networkId = await web3.eth.net.getId();

      // do the code above but do not use web3Modal
      const web3 = new Web3(window.ethereum);
      const provider = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const url = await uploadToIPFS();
      const networkId = await web3.eth.net.getId();

      // Mint the NFT
      const NFTContractAddress = NFT.networks[networkId].address;
      const NFTContract = new web3.eth.Contract(NFT.abi, NFTContractAddress);
      const accounts = await web3.eth.getAccounts();
      const marketPlaceContract = new web3.eth.Contract(
        Marketplace.abi,
        Marketplace.networks[networkId].address
      );
      let listingFee = await marketPlaceContract.methods.getListingFee().call();
      listingFee = listingFee.toString();
      setLoading(true);
      NFTContract.methods
        .mint(url)
        .send({ from: accounts[0] })
        .on("receipt", function (receipt) {
          console.log("minted");
          // List the NFT
          const tokenId = receipt.events.NFTMinted.returnValues[0];
          marketPlaceContract.methods
            .listNft(
              NFTContractAddress,
              tokenId,
              Web3.utils.toWei(formInput.price, "ether"),
              formInput.supply,
              formInput.royalty
            )
            .send({ from: accounts[0], value: listingFee })
            .on("receipt", function () {
              console.log("listed");
              // toast.success("Stem created", { id: notification });
              // create a custom toast that has a black border 2px
              toast.success("NFT listed", {
                id: notification,
                style: {
                  border: "2px solid #000",
                },
              });

              setLoading(false);
              // wait 2 seconds, then reload the page
              setTimeout(() => {
                router.push("/marketplace");
              }, 2000);
            });
        });
    } catch (error) {
      console.log(error);
      toast.error("Error creating stem", { id: notification });
    }
  }

  return (
    <div>
      <div className="flex justify-center items-center mb-4 mt-4">
        <div className="text-4xl font-bold text-center">
          Publish Your First Stem
        </div>
      </div>
      {/* two columns that split the page in a 30% 70% manner, 1 column per row in mobile view */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-black min-h-screen">
        {/* left column */}
        <div className=" bg-base-200">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <p className="py-6">
                Click some buttons, fill in some boxes, and go live in seconds.
                <br />
              </p>
              <p className="py-6">
                View the <a href="#">FAQ</a> for more information.
              </p>
            </div>
          </div>
        </div>

        {/* right column */}
        <div className="col-span-2 py-3 px-3">
          <div className="card flex-shrink-0 w-full shadow-2xl bg-base-100 border-black border-[2px]">
            <div className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">File</span>
                </label>

                <input
                  className="block w-full text-sm text-black bg-gray-50  border border-black cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-100 dark:border-gray-100 dark:placeholder-gray-400"
                  id="file_input"
                  type="file"
                  onChange={onChange}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Stem Title"
                  className="input border-black"
                  onChange={(e) =>
                    updateFormInput({ ...formInput, name: e.target.value })
                  }
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <input
                  type="text"
                  placeholder="Stem Description"
                  className="input border-black"
                  onChange={(e) =>
                    updateFormInput({
                      ...formInput,
                      description: e.target.value,
                    })
                  }
                />
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
          <div className="divider">or</div>
          <div className="card flex-shrink-0 w-full shadow-2xl bg-base-100 border-black border-[2px]">
            <div className="card-body">
              {/* centered big text that says Not Ready to Sell? */}
              <div className="text-center text-2xl ">Not Ready to Sell?</div>
              <div className="text-center text-2xl ">
                <p className="py-6">
                  <a href="#">Update your profile</a> to get started.
                </p>
              </div>

              <div className="form-control mt-6">
                <a href="#_" className="relative inline-block px-4 py-2  group">
                  <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-[#ff90e8] group-hover:-translate-x-0 group-hover:-translate-y-0 border-black border-t border-r border-b"></span>
                  <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-[#ff90e8]"></span>
                  <span className="relative text-black group-hover:text-black text-center flex flex-col">
                    Update Profile
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* footer */}
    </div>
  );
};

export default createItem;
