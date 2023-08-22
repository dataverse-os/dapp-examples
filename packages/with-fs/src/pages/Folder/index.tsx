import React, { useCallback, useContext } from "react";
import ReactJson from "react-json-view";
import {
  Currency,
  FolderType,
  StructuredFolder,
} from "@dataverse/dataverse-connector";
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
import { useNavigate } from "react-router-dom";

export const Folder = () => {
  const { modelParser } = useContext(AppContext);
  const navigate = useNavigate();

  /**
   * @summary import from @dataverse/hooks
   */
  const { pkh, foldersMap } = useStore();

  const { connectApp } = useApp({
    appId: modelParser.appId,
    onSuccess: result => {
      console.log("[connect]connect app success, result:", result);
    },
  });

  const { createFolder, createdFolder } = useCreateFolder({
    onSuccess: result => {
      console.log("[createFolder]create folder success, result:", result);
    },
  });

  const { changeFolderBaseInfo, changedFolder: changedFolderInfo } =
    useChangeFolderBaseInfo({
      onSuccess: result => {
        console.log(
          "[changeFolderBaseInfo]create folder success, result:",
          result,
        );
      },
    });

  const { readAllFolders, allFolders } = useReadAllFolders({
    onSuccess: result => {
      console.log("[readAllFolders]read all folders success, result:", result);
    },
  });

  const { deleteFolder, deletedFolder } = useDeleteFolder({
    onSuccess: result => {
      console.log("[deleteFolder]delete folder success, result:", result);
    },
  });

  /**
   * @summary custom methods
   */
  const connect = useCallback(async () => {
    connectApp();
  }, [connectApp]);

  const handleCreateFolder = useCallback(async () => {
    createFolder({
      folderType: FolderType.Private,
      folderName: "example",
      folderDescription: "example description",
    });
  }, [createFolder]);

  const handleChangeFolderBaseInfo = useCallback(async () => {
    if (!createdFolder) {
      console.error("createFolderResult undefined");
      return;
    }
    const folder = createdFolder as StructuredFolder;
    changeFolderBaseInfo({
      folderId: folder.folderId,
      newFolderName: "changed",
      newFolderDescription: "changed description",
    });
  }, [createdFolder, changeFolderBaseInfo]);

  const handleReadAllFolders = useCallback(async () => {
    readAllFolders();
  }, [readAllFolders]);

  const handleDeleteFolder = useCallback(async () => {
    /* if (!createdFolder) {
      console.error("createFolderResult undefined");
      return;
    } */
    const folder = createdFolder as StructuredFolder;
    deleteFolder({
      folderId: folder.folderId,
    });
  }, [createdFolder, deleteFolder]);

  return (
    <>
      <button onClick={connect}>connect</button>
      <div className='black-text'>{pkh}</div>
      {foldersMap && (
        <div className='json-view'>
          <ReactJson src={foldersMap} collapsed={true} />
        </div>
      )}
      <hr />
      <button onClick={handleCreateFolder}>createFolder</button>
      {createdFolder && (
        <div className='json-view'>
          <ReactJson src={createdFolder} collapsed={true} />
        </div>
      )}
      <button onClick={handleChangeFolderBaseInfo}>changeFolderBaseInfo</button>
      {changedFolderInfo && (
        <div className='json-view'>
          <ReactJson src={changedFolderInfo} collapsed={true} />
        </div>
      )}
      <button onClick={handleReadAllFolders}>readAllFolders</button>
      {allFolders && (
        <div className='json-view'>
          <ReactJson src={allFolders} collapsed={true} />
        </div>
      )}
      <button onClick={handleDeleteFolder}>deleteFolder</button>
      {deletedFolder && (
        <div className='json-view'>
          <ReactJson src={deletedFolder} collapsed={true} />
        </div>
      )}
      <br />
      <hr />
      <button onClick={() => navigate("/")}>Go To Home Page</button>
      <button onClick={() => navigate("/file")}>Go To File Page</button>
      <br />
    </>
  );
};
