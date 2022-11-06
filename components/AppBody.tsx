import React from "react";
import Head from "next/head";

import toast from "react-hot-toast";

import APIKeyForm from "./APIKeyForm";

import { APP_STATES } from "../utils/types";

interface Props {
  state: any;
  setApiKey: (
    apiKey: string,
    jwPlayerAPIKey: string,
    jwPlayerSecret: string,
    streamTitle: string
  ) => void;
  createStream: () => void;
}

const copyTextToClipboard = (text: string) => {
  navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
    if (result.state == "granted" || result.state == "prompt") {
      navigator.clipboard.writeText(text);
    }
  });
};

const AppBody: React.FC<Props> = ({ state, setApiKey, createStream }) => {
  const { playbackId, streamIsActive, streamKey } = state;
  const [showRequest, setShowRequest] = React.useState(false);

  switch (state.appState) {
    case APP_STATES.API_KEY:
      return <APIKeyForm setApiKey={setApiKey} />;
    case APP_STATES.CREATE_BUTTON:
      return (
        <div className="w-full h-3/5 flex items-center justify-center">
          {/* <button
            className="text-2xl border border-black rounded p-2"
            onClick={createStream}
          >
            Create Stream
          </button> */}
          <button
            onClick={createStream}
            className="relative inline-block px-4 py-2  group"
          >
            <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-[#6AB313] group-hover:-translate-x-0 group-hover:-translate-y-0 border-black border-[2px]"></span>
            <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-[#6AB313]"></span>

            <span className="relative text-black group-hover:text-black ">
              Go Live!
            </span>
          </button>
        </div>
      );
    case APP_STATES.CREATING_STREAM:
      return (
        <div className="w-full h-3/5 flex flex-col items-center justify-center">
          <div className="animate-spin w-8 h-8 rounded-full border-2 border-livepeer border-r-0 border-b-0 mb-8"></div>
          Creating stream...
        </div>
      );
    case APP_STATES.WAITING_FOR_VIDEO:
    case APP_STATES.SHOW_VIDEO:
      const headers = JSON.stringify(
        {
          "content-type": "application/json",
          authorization: `Bearer ${state.apiKey}`,
        },
        undefined,
        2
      );
      const body = JSON.stringify(
        {
          name: "test_stream",
          profiles: [
            {
              name: "720p",
              bitrate: 2000000,
              fps: 30,
              width: 1280,
              height: 720,
            },
            {
              name: "480p",
              bitrate: 1000000,
              fps: 30,
              width: 854,
              height: 480,
            },
            {
              name: "360p",
              bitrate: 500000,
              fps: 30,
              width: 640,
              height: 360,
            },
          ],
        },
        undefined,
        2
      );
      const response = JSON.stringify(
        {
          isActive: false,
          streamKey: state.streamKey,
          playbackId: state.playbackId,
        },
        undefined,
        2
      );
      return (
        <div className="container w-full flex flex-col items-center overflow-hidden pb-14">
          <div
            className="relative bg-black w-full xl:w-3/5 overflow-hidden"
            style={{ minHeight: "400px" }}
          >
            <div id={`botr_${state.divKey}_div`} className="h-full w-full" />
            {streamIsActive && state.jwPlayerHostedLibraryLink && (
              <Head>
                <script src={state.jwPlayerHostedLibraryLink} />
              </Head>
            )}
            <div className="bg-white rounded-xl flex items-center justify-center absolute right-2 top-2 p-1 text-xs">
              <div
                className={`animate-pulse ${
                  streamIsActive ? "bg-green-700" : "bg-yellow-600"
                } h-2 w-2 mr-2 rounded-full`}
              ></div>
              {streamIsActive ? "Live" : "Waiting for Video"}
            </div>
          </div>

          <div className="w-11/12 lg:w-full xl:w-3/5 lg:p-0 mt-2 text-red-500 text-center text-sm font-bold">
            <span className="font-bold">Note:&nbsp;</span> OBS Studio is highly
            recommended for streaming to DeStemr.{" "}
          </div>
          <div className="w-11/12 lg:w-full xl:w-3/5 p-2 m-4 flex flex-col text-sm border-[2px] border-black">
            <div className="flex items-center justify-between mt-2 break-all">
              <span>
                <span className="font-bold">Ingest URL:</span>
                <br />
                rtmp://rtmp.livepeer.com/live/
              </span>
              <button
                onClick={() =>
                  // copyTextToClipboard(`rtmp://rtmp.livepeer.com/live/`)

                  // code as above as also toast success message
                  toast.success("Ingest URL copied to clipboard!", {
                    style: {
                      border: "2px solid #000",
                      // make bold
                      fontWeight: "bold",
                    },
                  }) && copyTextToClipboard(`rtmp://rtmp.livepeer.com/live/`)
                }
                className="border ml-1 p-1 rounded text-sm break-normal hover:bg-gray-400"
              >
                Copy
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 break-all mb-6">
              <span>
                <span className="font-bold">Stream Key:</span>
                <br />
                {streamKey}
              </span>
              <button
                // onClick={() => copyTextToClipboard(streamKey)}
                // on click copy streamkey to clipboard and also show a toast notification
                onClick={() => {
                  copyTextToClipboard(streamKey);
                  const notification = toast.success(
                    "Stream Key copied to clipboard!",
                    {
                      style: {
                        border: "2px solid #000",
                        // make bold
                        fontWeight: "bold",
                      },
                    }
                  );
                  notification;
                }}
                className="border ml-1 p-1 rounded text-sm break-normal hover:bg-gray-400"
              >
                Copy
              </button>
            </div>
            {/* <div className="flex items-center justify-between mt-2 break-all">
              <span>
                <span className="font-bold">Playback URL:</span>
                <br />
                https://cdn.livepeer.com/hls/{playbackId}/index.m3u8
              </span>
              <button
                onClick={() =>
                  copyTextToClipboard(
                    `https://cdn.livepeer.com/hls/${playbackId}/index.m3u8`
                  )
                }
                className="border ml-1 p-1 rounded text-sm break-normal hover:bg-gray-400"
              >
                Copy
              </button>
            </div> */}
            <div className="flex items-center justify-between mt-4 break-all">
              <span>
                <span className="font-bold">
                  Share video: <br />
                </span>
                {/* {`${"https://destemrlivepeer.vercel.app/"}video/${state.divKey.replace(
                  "_",
                  "-"
                )}`} */}
                {`https://destemrlivepeer.vercel.app/video/${state.divKey.replace(
                  "_",
                  "-"
                )}`}
              </span>
              <button
                onClick={() =>
                  toast.success("Stream URL copied to clipboard!", {
                    style: {
                      border: "2px solid #000",
                      // make bold
                      fontWeight: "bold",
                    },
                  }) &&
                  copyTextToClipboard(
                    `https://destemrlivepeer.vercel.app/video/${state.divKey.replace(
                      "_",
                      "-"
                    )}`
                  )
                }
                className="border ml-1 p-1 rounded text-sm break-normal hover:bg-gray-400"
              >
                Copy
              </button>
            </div>
          </div>
          {/* <div className="w-11/12 lg:w-full xl:w-3/5 flex flex-col items-center mt-8">
            <button
              onClick={() => setShowRequest((val) => !val)}
              className="text-gray-500 text-sm text-center w-full mb-2"
            >
              {showRequest ? "Hide" : "Show"} POST /stream request creating a
              stream{" "}
              <span className="text-xs">
                {showRequest ? <>&#9650;</> : <>&#9660;</>}
              </span>{" "}
            </button>
            {showRequest && (
              <>
                <fieldset className="w-full md:w-2/3 text-sm border border-dashed border-gray p-4 rounded flex flex-col">
                  <legend>Request</legend>
                  <div className="text-xs">
                    Headers: <br />
                    <textarea
                      rows={5}
                      cols={30}
                      value={headers}
                      disabled
                      className="w-full resize-none leading-5"
                      style={{
                        fontFamily: "Lucida Console, Monospace",
                      }}
                    />
                  </div>
                  <div className="text-xs mt-8">
                    Body: <br />
                    <textarea
                      rows={26}
                      cols={30}
                      value={body}
                      disabled
                      className="w-full resize-none leading-5"
                      style={{
                        fontFamily: "Lucida Console, Monospace",
                      }}
                    />
                  </div>
                </fieldset>
                <fieldset className="w-full md:w-2/3 text-sm border border-dashed border-gray p-4 rounded flex flex-col">
                  <legend>Response</legend>
                  <div className="text-xs">
                    <textarea
                      rows={5}
                      cols={30}
                      value={response}
                      disabled
                      className="w-full resize-none leading-5"
                      style={{
                        fontFamily: "Lucida Console, Monospace",
                      }}
                    />
                  </div>
                </fieldset>
              </>
            )}
          </div> */}
        </div>
      );
    default:
      return null;
  }
};

export default AppBody;
