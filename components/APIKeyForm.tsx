import React from "react";

interface Props {
  setApiKey: (
    apiKey: string,
    jwPlayerAPIKey: string,
    jwPlayerSecret: string,
    streamTitle: string
  ) => void;
}
const APIKeyForm: React.FC<Props> = ({ setApiKey }) => {
  const submitHandler = (event: React.SyntheticEvent) => {
    const {
      apiKey,
      jwPlayerAPIKey,
      jwPlayerSecret,
      streamTitle,
    } = event.target as HTMLFormElement;

    setApiKey(
      apiKey.value,
      jwPlayerAPIKey.value,
      jwPlayerSecret.value,
      streamTitle.value
    );
  };

  return (
    <div>
      <form
        className="px-4 h-3/5 flex justify-center flex-col lg:max-w-screen-md m-auto"
        onSubmit={submitHandler}
      >
        <div className="flex flex-col border-[2px] border-black py-2 text-center">
          <h1 className="font-bold underline text-xl">For Demo Purposes:</h1>
          <p className="font-bold">
            LivePeer API Key: 9fcff099-e211-4847-8e62-a85dd15c1506
          </p>
          <p className="font-bold">JWPlayer API Key: iSIdxRsD</p>
          <p className="font-bold">JWPlayer Secret: Rn9V4gVAxsTlJ5LOEjAPUMvY</p>
        </div>
        <br />
        <label htmlFor="apiKey">Livepeer.com API KEY:</label>
        <input
          type="text"
          placeholder="Enter your api key"
          className="border border-black active:border-livepeer p-2 w-full rounded mb-8 input input-bordered"
          name="apiKey"
          required
        />

        <label htmlFor="apiKey">JWPlayer:</label>
        <input
          type="text"
          placeholder="Enter JWPlayer API Key"
          className="border border-black active:border-livepeer p-2 w-full rounded mb-2 input input-bordered"
          name="jwPlayerAPIKey"
          required
        />
        <input
          type="text"
          placeholder="Enter JWPlayer API Secret"
          className="border border-black active:border-livepeer p-2 w-full rounded mb-4 input input-bordered"
          name="jwPlayerSecret"
          required
        />

        <label>Livestream Title:</label>
        <input
          type="text"
          placeholder="Enter video title"
          className="border border-black active:border-livepeer p-2 w-full rounded mb-4 input input-bordered"
          name="streamTitle"
          defaultValue="Sample Livepeer DeStemr Stream"
        />
        {/* <button
          type="submit"
          className="btn btn-primary border border-1 border-black rounded px-4 py-2 lg:w-24 mx-auto 
          tracking-wider"
        >
          Start!
        </button> */}
        <button
          type="submit"
          className="relative inline-block px-4 py-2  group"
        >
          <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-[#6AB313] group-hover:-translate-x-0 group-hover:-translate-y-0 border-black border-[2px]"></span>
          <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-[#6AB313]"></span>

          <span className="relative text-black group-hover:text-black ">
            Go Live!
          </span>
        </button>
      </form>
    </div>
  );
};

export default APIKeyForm;
