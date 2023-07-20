import "./App.css";
import React, { useState, useEffect } from "react";
import ReactJson from "react-json-view";
import {
  ReturnType,
  Currency,
  SYSTEM_CALL,
  DataverseConnector,
  Extension,
} from "@dataverse/dataverse-connector";
import { useWallet, useStream } from "@dataverse/hooks";
import { Model, ModelParser, Output } from "@dataverse/model-parser";
import app from "../output/app.json";
import pacakage from "../package.json";

type StreamRecord = Awaited<ReturnType[SYSTEM_CALL.loadStream]>;
const dataverseConnector = new DataverseConnector(Extension);
const appVersion = pacakage.version;
const modelParser = new ModelParser(app as Output);

function App() {
  const [postModel, setPostModel] = useState<Model>();
  const [currentStreamId, setCurrentStreamId] = useState<string>();
  const [publicPost, setPublicPost] = useState<StreamRecord>();
  const [encryptedPost, setEncryptedPost] = useState<StreamRecord>();
  const [payablePost, setPayablePost] = useState<StreamRecord>();
  const [posts, setPosts] = useState<StreamRecord[]>(); // All posts
  const [updatedPost, setUpdatedPost] = useState<StreamRecord>();
  const [monetizedPost, setMonetizedPost] = useState<StreamRecord>();
  const [unlockedPost, setUnlockedPost] = useState<StreamRecord>();

  const { connectWallet } = useWallet(dataverseConnector);

  const {
    pkh,
    createCapability,
    loadStreams,
    createPublicStream,
    createEncryptedStream,
    createPayableStream,
    monetizeStream,
    unlockStream,
    updateStream,
  } = useStream({
    dataverseConnector,
    appId: modelParser.appId,
  });

  useEffect(() => {
    const postModel = modelParser.getModelByName("post");
    setPostModel(postModel);
  }, []);

  const connect = async () => {
    const { wallet } = await connectWallet();
    const pkh = await createCapability(wallet);
    console.log("pkh:", pkh);
    return pkh;
  };

  const createPublicPost = async () => {
    if (!postModel) {
      console.error("postModel undefined");
      return;
    }
    const date = new Date().toISOString();
    const { streamId, ...streamRecord } = await createPublicStream({
      model: postModel,
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
    });

    setCurrentStreamId(streamId);
    setPublicPost(streamRecord as StreamRecord);
  };

  const createEncryptedPost = async () => {
    if (!postModel) {
      console.error("postModel undefined");
      return;
    }

    const date = new Date().toISOString();
    const { streamId, ...streamRecord } = await createEncryptedStream({
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

    setCurrentStreamId(streamId);
    setEncryptedPost(streamRecord as StreamRecord);
  };

  const createPayablePost = async () => {
    if (!postModel) {
      console.error("postModel undefined");
      return;
    }
    if (!pkh) {
      console.error("need to create capability");
      return;
    }

    const date = new Date().toISOString();
    const { streamId, ...streamRecord } = await createPayableStream({
      pkh,
      modelId: postModel.streams[postModel.streams.length - 1].modelId,
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
      lensNickName: "luketheskywalker1", //Only supports lower case characters, numbers, must be minimum of 5 length and maximum of 26 length
      currency: Currency.WMATIC,
      amount: 0.0001,
      collectLimit: 1000,
      encrypted: {
        text: true,
        images: true,
        videos: false,
      },
    });

    setCurrentStreamId(streamId);
    setPayablePost(streamRecord as StreamRecord);
  };

  const loadPosts = async () => {
    if (!postModel) {
      console.error("postModel undefined");
      return;
    }

    const postRecord = await loadStreams({
      pkh,
      modelId: postModel.streams[0].modelId,
    });
    console.log("loadPosts postRecord:", postRecord);
    setPosts(Object.values(postRecord));
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
    const { streamId, ...streamRecord } = await updateStream({
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

    setUpdatedPost(streamRecord as StreamRecord);
  };

  const monetizePost = async () => {
    if (!postModel) {
      console.error("postModel undefined");
      return;
    }
    if (!pkh) {
      console.error("need to create capability");
      return;
    }
    if (!currentStreamId) {
      console.error("currentStreamId undefined");
      return;
    }
    const { streamId, ...streamRecord } = await monetizeStream({
      pkh,
      modelId: postModel.streams[0].modelId,
      streamId: currentStreamId,
      lensNickName: "jackieth", //Only supports lower case characters, numbers, must be minimum of 5 length and maximum of 26 length
      currency: Currency.WMATIC,
      amount: 0.0001,
      collectLimit: 1000,
    });

    setMonetizedPost(streamRecord as StreamRecord);
  };

  const unlockPost = async () => {
    if (!currentStreamId) {
      return;
    }
    const { streamId, ...streamRecord } = await unlockStream(currentStreamId);

    setUnlockedPost(streamRecord as StreamRecord);
  };

  return (
    <div className="App">
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
    </div>
  );
}

export default App;
