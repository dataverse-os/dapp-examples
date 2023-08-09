import React, { useCallback, useContext } from "react";
import ReactJson from "react-json-view";
import { Currency, FolderType, StructuredFolder } from "@dataverse/dataverse-connector";
import {
  useApp,
  useChangeFolderBaseInfo,
  useChangeFolderType,
  useCreateFolder,
  useDeleteFolder,
  useMonetizeFolder,
  useReadAllFolders,
  useStore,
} from "@dataverse/hooks";
import { AppContext } from "../../main";

const Folder = () => {
  const { modelParser } = useContext(AppContext);

  /**
   * @summary import from @dataverse/hooks
   */
  const {
    state: { pkh, folderMap },
  } = useStore();

  const { connectApp } = useApp({
    onSuccess: (result) => {
      console.log("[connect]connect app success, result:", result);
    },
  });

  const { createFolder, createdFolder } = useCreateFolder({
    onSuccess: (result) => {
      console.log("[createFolder]create folder success, result:", result);
    },
  })

  const { changeFolderBaseInfo, changedFolder: changedFolderInfo } = useChangeFolderBaseInfo({
    onSuccess: (result) => {
      console.log("[changeFolderBaseInfo]create folder success, result:", result);
    },
  })

  const { changeFolderType, changedFolder: changedFolderType } = useChangeFolderType({
    onSuccess: (result) => {
      console.log("[changeFolderType]create folder success, result:", result);
    }
  })

  const { readAllFolders, allFolders } = useReadAllFolders({
    onSuccess: (result) => {
      console.log("[readAllFolders]read all folders success, result:", result);
    }
  })

  const { deleteFolder, deletedFolder } = useDeleteFolder({
    onSuccess: (result) => {
      console.log("[deleteFolder]delete folder success, result:", result);
    }
  })

  const { monetizeFolder, monetizedFolder } = useMonetizeFolder({
    onSuccess: (result) => {
      console.log("[monetizeFolder]monetize folder success, result:", result);
    }
  })

  /**
   * @summary custom methods
   */
  const connect = useCallback(async () => {
    connectApp({
      appId: modelParser.appId,
    });
  }, [modelParser]);

  const handleCreateFolder = useCallback(async () => {
    createFolder({
      folderType: FolderType.Private,
      folderName: 'example',
      folderDescription: 'example description'
    })
  }, []);

  const handleChangeFolderBaseInfo = useCallback(async () => {
    if (!createdFolder) {
      console.error("createFolderResult undefined");
      return;
    }
    const folder = createdFolder as StructuredFolder;
    changeFolderBaseInfo({
      folderId: folder.folderId,
      newFolderName: 'changed',
      newFolderDescription: 'changed description'
    })
  }, [createdFolder]);

  const handleReadAllFolders = useCallback(async () => {
    readAllFolders();
  }, []);

  const handleChangeFolderType = useCallback(async () => {
    if (!createdFolder) {
      console.error("createFolderResult undefined");
      return;
    }
    const folder = createdFolder as StructuredFolder;
    changeFolderType({
      folderId: folder.folderId,
      targetFolderType: FolderType.Public
    })
  }, [createdFolder]);

  const handleDeleteFolder = useCallback(async () => {
    /* if (!createdFolder) {
      console.error("createFolderResult undefined");
      return;
    } */
    const folder = createdFolder as StructuredFolder;
    deleteFolder({
      folderId: folder.folderId
    })
  }, [createdFolder]);

  const handleMonetizeFolder = useCallback(async () => {
    if (!createdFolder) {
      console.error("createFolderResult undefined");
      return;
    }
    const folder = createdFolder as StructuredFolder;
    monetizeFolder({
      folderId: folder.folderId,
      folderDescription: "monetized folder description",
      currency: Currency.WMATIC,
      amount: 0.0001,
      collectLimit: 1000,
    })
  }, [createdFolder]);

  return (
    <>
      <button onClick={connect}>connect</button>
      <div className="black-text">{pkh}</div>
      {folderMap && (
        <div className="json-view">
          <ReactJson src={folderMap} collapsed={true} />
        </div>
      )}
      <hr />
      <button onClick={handleCreateFolder}>createFolder</button>
      {createdFolder && (
        <div className="json-view">
          <ReactJson src={createdFolder} collapsed={true} />
        </div>
      )}
      <button onClick={handleChangeFolderBaseInfo}>changeFolderBaseInfo</button>
      {changedFolderInfo && (
        <div className="json-view">
          <ReactJson src={changedFolderInfo} collapsed={true} />
        </div>
      )}
      <button onClick={handleChangeFolderType}>changeFolderType</button>
      {changedFolderType && (
        <div className="json-view">
          <ReactJson src={changedFolderType} collapsed={true} />
        </div>
      )}
      <button onClick={handleReadAllFolders}>readAllFolders</button>
      {allFolders && (
        <div className="json-view">
          <ReactJson src={allFolders} collapsed={true} />
        </div>
      )}
      <button onClick={handleDeleteFolder}>deleteFolder</button>
      {deletedFolder && (
        <div className="json-view">
          <ReactJson src={deletedFolder} collapsed={true} />
        </div>
      )}
      <button onClick={handleMonetizeFolder}>monetizeFolder</button>
      {monetizedFolder && (
        <div className="json-view">
          <ReactJson src={monetizedFolder} collapsed={true} />
        </div>
      )}
      <br />
    </>
  );
}

export default Folder;