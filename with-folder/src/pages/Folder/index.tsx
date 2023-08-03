import "./index.css";
import React, { useCallback, useContext } from "react";
import ReactJson from "react-json-view";
import { FolderType, MirrorFile, StorageProviderName, StructuredFolder } from "@dataverse/dataverse-connector";
import {
  useApp,
  useChangeFolderBaseInfo,
  useChangeFolderType,
  useCreateFolder,
  useDeleteFolder,
  useMoveFiles,
  useReadAllFolders,
  useRemoveFiles,
  useStore,
  useUpdateFileBaseInfo,
  useUploadFile,
} from "@dataverse/hooks";
import { AppContext } from "../../main";

const Folder = () => {
  const { modelParser } = useContext(AppContext);

  /**
   * @summary import from @dataverse/hooks
   */
  const {
    state: { pkh, folders },
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

  const { uploadFile, uploadedFile } = useUploadFile({
    onSuccess: (result) => {
      console.log("[uploadFile]upload file success, result:", result);
    }
  })

  const { updateFileBaseInfo, updatedFile } = useUpdateFileBaseInfo({
    onSuccess: (result) => {
      console.log("[updateFileBaseInfo]update file base info success, result:", result);
    }
  })

  const { moveFiles, movedFiles } = useMoveFiles({
    onSuccess: (result) => {
      console.log("[moveFiles]move files success, result:", result);
    }
  })

  const { removeFiles, removedFiles } = useRemoveFiles({
    onSuccess: (result) => {
      console.log("[removeFiles]remove files success, result:", result);
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
    if (!createdFolder) {
      console.error("createFolderResult undefined");
      return;
    }
    const folder = createdFolder as StructuredFolder;
    deleteFolder({
      folderId: folder.folderId
    })
  }, [createdFolder]);

  const handleUploadFile = useCallback(async () => {
    if (!createdFolder) {
      console.error("createFolderResult undefined");
      return;
    }
    const folder = createdFolder as StructuredFolder;
    uploadFile({
      folderId: folder.folderId,
      fileName: 'example.txt',
      fileBase64: 'dGVzdA==',
      encrypted: false,
      storageProvider: {
        name: StorageProviderName.Web3Storage,
        // TODO: your api token
        apiKey: ''
      },
      reRender: true
    })
  }, [createdFolder]);

  const handleUpdateFileBaseInfo = useCallback(async () => {
    if (!uploadedFile) {
      console.error("uploadedFile undefined");
      return;
    }
    const result = uploadedFile as MirrorFile;
    updateFileBaseInfo({
      indexFileId: result.indexFileId,
      fileInfo: {
        note: 'changed note'
      }
    })
  }, [uploadedFile]);

  const handleMoveFiles = useCallback(async () => {
    if (!uploadedFile) {
      console.error("uploadedFile undefined");
      return;
    }
    const file = uploadedFile as MirrorFile;
    moveFiles({
      sourceIndexFileIds: [file.indexFileId],
      // TODO: your target folder id
      targetFolderId: "kjzl6kcym7w8y8t3ar6jgwssf6mm4i834k09bjb3zdnjq2ir446pj7izlbqda60"
    })
  }, [uploadedFile]);

  const handleRemoveFiles = useCallback(async () => {
    if (!uploadedFile) {
      console.error("uploadedFile undefined");
      return;
    }
    const file = uploadedFile as MirrorFile;
    removeFiles({
      indexFileIds: [file.indexFileId],
    })
  }, [uploadedFile]);

  return (
    <>
      <button onClick={connect}>connect</button>
      <div className="black-text">{pkh}</div>
      {folders && (
        <div className="json-view">
          <ReactJson src={folders} collapsed={true} />
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
      <button onClick={handleUploadFile}>uploadFile</button>
      {uploadedFile && (
        <div className="json-view">
          <ReactJson src={uploadedFile} collapsed={true} />
        </div>
      )}
      <button onClick={handleUpdateFileBaseInfo}>updateFileBaseInfo</button>
      {updatedFile && (
        <div className="json-view">
          <ReactJson src={updatedFile} collapsed={true} />
        </div>
      )}
      <button onClick={handleMoveFiles}>moveFiles</button>
      {movedFiles && (
        <div className="json-view">
          <ReactJson src={movedFiles} collapsed={true} />
        </div>
      )}
      <button onClick={handleRemoveFiles}>removeFiles</button>
      {removedFiles && (
        <div className="json-view">
          <ReactJson src={removedFiles} collapsed={true} />
        </div>
      )}
      <br />
    </>
  );
}

export default Folder;
