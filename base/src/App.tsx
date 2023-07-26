import "./App.css";
import React, { useState, useEffect } from "react";
import ReactJson from "react-json-view";
import { Currency, DataverseConnector } from "@dataverse/dataverse-connector";
import {
  useApp,
  useCreateEncryptedStream,
  useCreatePayableStream,
  useCreatePublicStream,
  useLoadStreams,
  useMonetizeStream,
  useStore,
  useUnlockStream,
  useUpdateStream,
} from "@dataverse/hooks";
import { Model, ModelParser, Output } from "@dataverse/model-parser";
import app from "../output/app.json";
import pacakage from "../package.json";

const dataverseConnector = new DataverseConnector();
const appVersion = pacakage.version;
const modelParser = new ModelParser(app as Output);

function App() {
  const [postModel, setPostModel] = useState<Model>();
  const [currentStreamId, setCurrentStreamId] = useState<string>();
  useEffect(() => {
    const postModel = modelParser.getModelByName("post");
    setPostModel(postModel);
  }, []);

  /**
   * @summary import from @dataverse/hooks
   */
  const {
    state: { address, pkh, streamsMap: posts },
  } = useStore();

  const { connectApp } = useApp({
    dataverseConnector,
    onSuccess: (result) => {
      console.log("[connect]connect app success, result:", result);
    },
  });

  const { result: publicPost, createPublicStream } = useCreatePublicStream({
    dataverseConnector,
    onSuccess: (result: any) => {
      console.log("[createPublicPost]create public stream success:", result);
      setCurrentStreamId(result.streamId);
    },
  });

  const { result: encryptedPost, createEncryptedStream } =
    useCreateEncryptedStream({
      dataverseConnector,
      onSuccess: (result: any) => {
        console.log(
          "[createEncryptedPost]create encrypted stream success:",
          result
        );
        setCurrentStreamId(result.streamId);
      },
    });

  const { result: payablePost, createPayableStream } = useCreatePayableStream({
    dataverseConnector,
    onSuccess: (result: any) => {
      console.log("[createPayablePost]create payable stream success:", result);
      setCurrentStreamId(result.streamId);
    },
  });

  const { loadStreams } = useLoadStreams({
    dataverseConnector,
    onError: (error) => {
      console.error("[loadPosts]load streams failed,", error);
    },
    onSuccess: (result) => {
      console.log("[loadPosts]load streams success, result:", result);
    },
  });

  const { result: updatedPost, updateStream } = useUpdateStream({
    dataverseConnector,
    onSuccess: (result) => {
      console.log("[updatePost]update stream success, result:", result);
    },
  });

  const { result: monetizedPost, monetizeStream } = useMonetizeStream({
    dataverseConnector,
    onSuccess: (result) => {
      console.log("[monetize]monetize stream success, result:", result);
    },
  });

  const { result: unlockedPost, unlockStream } = useUnlockStream({
    dataverseConnector,
    onSuccess: (result) => {
      console.log("[unlockPost]unlock stream success, result:", result);
    },
  });

  /**
   * @summary custom methods
   */
  const connect = () => {
    connectApp({
      appId: modelParser.appId,
    });
  };

  const createPublicPost = async () => {
    if (!postModel) {
      console.error("postModel undefined");
      return;
    }

    createPublicStream({
      model: postModel,
      stream: {
        appVersion,
        text: "hello",
        images: [
          "https://bafkreib76wz6wewtkfmp5rhm3ep6tf4xjixvzzyh64nbyge5yhjno24yl4.ipfs.w3s.link",
        ],
        videos: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  };

  const createEncryptedPost = async () => {
    if (!postModel) {
      console.error("postModel undefined");
      return;
    }

    const date = new Date().toISOString();

    createEncryptedStream({
      modelId: postModel.streams[postModel.streams.length - 1].modelId,
      stream: {
        appVersion,
        text: "hello",
        images: [
          "https://bafkreib76wz6wewtkfmp5rhm3ep6tf4xjixvzzyh64nbyge5yhjno24yl4.ipfs.w3s.link",
        ],
        videos: [],
        createdAt: date,
        updatedAt: date,
      },
      encrypted: {
        text: true,
        images: true,
        videos: false,
      },
    });
  };

  const createPayablePost = async () => {
    if (!postModel) {
      console.error("postModel undefined");
      return;
    }

    if (!address || !pkh) {
      console.error("need connect app first");
      return;
    }

    const profileIds = await dataverseConnector.getProfiles(address);
    if (profileIds.length == 0) {
      console.error("no available lens profiles");
      return;
    }
    const profileId = profileIds[0].id;
    const date = new Date().toISOString();
    createPayableStream({
      modelId: postModel.streams[postModel.streams.length - 1].modelId,
      profileId,
      stream: {
        appVersion,
        text: "metaverse",
        images: [
          "https://bafkreidhjbco3nh4uc7wwt5c7auirotd76ch6hlzpps7bwdvgckflp7zmi.ipfs.w3s.link/",
        ],
        videos: [],
        createdAt: date,
        updatedAt: date,
      },
      currency: Currency.WMATIC,
      amount: 0.0001,
      collectLimit: 1000,
      encrypted: {
        text: true,
        images: true,
        videos: false,
      },
    });
  };

  const loadPosts = async () => {
    if (!postModel) {
      console.error("postModel undefined");
      return;
    }

    await loadStreams({
      pkh,
      modelId: postModel.streams[0].modelId,
    });
  };

  const updatePost = async () => {
    if (!postModel) {
      console.error("postModel undefined");
      return;
    }
    if (!currentStreamId) {
      console.error("currentStreamId undefined");
      return;
    }
    updateStream({
      model: postModel,
      streamId: currentStreamId,
      stream: {
        text: "update my post -- " + new Date().toISOString(),
        images: [
          "https://bafkreidhjbco3nh4uc7wwt5c7auirotd76ch6hlzpps7bwdvgckflp7zmi.ipfs.w3s.link",
        ],
      },
      encrypted: {
        text: true,
        images: true,
        videos: false,
      },
    });
  };

  const monetizePost = async () => {
    if (!postModel) {
      console.error("postModel undefined");
      return;
    }
    if (!pkh || !address) {
      console.error("need connect app first");
      return;
    }
    if (!currentStreamId) {
      console.error("currentStreamId undefined");
      return;
    }
    const profileIds = await dataverseConnector.getProfiles(address);
    if (profileIds.length == 0) {
      console.error("no available lens profiles");
      return;
    }
    const profileId = profileIds[0].id;
    monetizeStream({
      streamId: currentStreamId,
      profileId,
      currency: Currency.WMATIC,
      amount: 0.0001,
      collectLimit: 1000,
    });
  };

  const unlockPost = async () => {
    if (!currentStreamId) {
      console.error("currentStreamId undefined");
      return;
    }
    unlockStream(currentStreamId);
  };

  return (
    <>
      <button onClick={connect}>connect</button>
      <div className="blackText">{pkh}</div>
      <hr />
      <button onClick={createPublicPost}>createPublicPost</button>
      {publicPost && (
        <div className="json-view">
          <ReactJson src={publicPost} collapsed={true} />
        </div>
      )}
      <button onClick={createEncryptedPost}>createEncryptedPost</button>
      {encryptedPost && (
        <div className="json-view">
          <ReactJson src={encryptedPost} collapsed={true} />
        </div>
      )}
      <button onClick={createPayablePost}>createPayablePost</button>
      {payablePost && (
        <div className="json-view">
          <ReactJson src={payablePost} collapsed={true} />
        </div>
      )}
      <div className="red">
        You need a testnet lens profile to monetize data.
      </div>
      <button onClick={loadPosts}>loadPosts</button>
      {posts && (
        <div className="json-view">
          <ReactJson src={posts} collapsed={true} />
        </div>
      )}
      <button onClick={updatePost}>updatePost</button>
      {updatedPost && (
        <div className="json-view">
          <ReactJson src={updatedPost} collapsed={true} />
        </div>
      )}
      <button onClick={monetizePost}>monetizePost</button>
      {monetizedPost && (
        <div className="json-view">
          <ReactJson src={monetizedPost} collapsed={true} />
        </div>
      )}
      <button onClick={unlockPost}>unlockPost</button>
      {unlockedPost && (
        <div className="json-view">
          <ReactJson src={unlockedPost} collapsed={true} />
        </div>
      )}
      <br />
    </>
  );
}

export default App;
