import React, { useCallback, useContext, useMemo } from "react";
import ReactJson from "react-json-view";
import {
  Currency,
  MirrorFile,
  StorageProviderName,
} from "@dataverse/dataverse-connector";
import {
  useApp,
  useMonetizeFile,
  useMoveFiles,
  useRemoveFiles,
  useStore,
  useUpdateFileBaseInfo,
  useUploadFile,
} from "@dataverse/hooks";
import { AppContext } from "../../main";
import { useNavigate } from "react-router-dom";

export const File = () => {
  const { modelParser } = useContext(AppContext);
  const navigate = useNavigate();

  /**
   * @summary import from @dataverse/hooks
   */
  const { pkh, foldersMap } = useStore();

  const currentFolderId = useMemo(() => {
    if(foldersMap) {
      const sortedFolerIds = Object.keys(foldersMap)
        .filter(
          (el) =>
            foldersMap[el].options.folderName !=
            modelParser.output.defaultFolderName
        )
        .sort(
          (a, b) =>
            Date.parse(foldersMap[b].createdAt) -
            Date.parse(foldersMap[a].createdAt)
        );
      return sortedFolerIds[0];
    } else {
      return undefined;
    }
  }, [foldersMap]);

  const { connectApp } = useApp({
    appId: modelParser.appId,
    onSuccess: (result) => {
      console.log("[connect]connect app success, result:", result);
    },
  });

  const { uploadFile, uploadedFile } = useUploadFile({
    onSuccess: (result) => {
      console.log("[uploadFile]upload file success, result:", result);
    },
  });

  const { updateFileBaseInfo, updatedFile } = useUpdateFileBaseInfo({
    onSuccess: (result) => {
      console.log(
        "[updateFileBaseInfo]update file base info success, result:",
        result
      );
    },
  });

  const { moveFiles, movedFiles } = useMoveFiles({
    onSuccess: (result) => {
      console.log("[moveFiles]move files success, result:", result);
    },
  });

  const { removeFiles, removedFiles } = useRemoveFiles({
    onSuccess: (result) => {
      console.log("[removeFiles]remove files success, result:", result);
    },
  });

  const { monetizeFile, monetizedFile } = useMonetizeFile({
    onSuccess: (result) => {
      console.log("[monetizeFile]monetize file success, result:", result);
    },
  });

  /**
   * @summary custom methods
   */
  const connect = useCallback(async () => {
    connectApp();
  }, [connectApp]);

  const handleUploadFile = useCallback(async () => {
    const name = StorageProviderName.Web3Storage;
    const apiKey =
      name === StorageProviderName.Web3Storage
        ? (import.meta as any).env.VITE_WEB3_STORAGE_API_KEY
        : (import.meta as any).env.VITE_LIGHTHOUSE_API_KEY;
    uploadFile({
      fileName: "example.txt",
      fileBase64: "dGVzdA==",
      encrypted: false,
      storageProvider: {
        name,
        apiKey,
      },
    });
  }, []);

  const handleUpdateFileBaseInfo = useCallback(async () => {
    if (!uploadedFile) {
      console.error("uploadedFile undefined");
      return;
    }
    const result = uploadedFile as MirrorFile;
    updateFileBaseInfo({
      indexFileId: result.indexFileId,
      fileInfo: {
        note: "changed note",
      },
    });
  }, [uploadedFile]);

  const handleMoveFiles = useCallback(async () => {
    if (!uploadedFile) {
      console.error("uploadedFile undefined");
      return;
    }
    if (!currentFolderId) {
      console.error("currentFolerId undefined, please readAllFolders first!");
      return;
    } else {
      console.log("currentFolerId:", currentFolderId)
    }
    const file = uploadedFile as MirrorFile;
    moveFiles({
      sourceIndexFileIds: [file.indexFileId],
      targetFolderId: currentFolderId,
    });
  }, [uploadedFile]);

  const handleRemoveFiles = useCallback(async () => {
    if (!uploadedFile) {
      console.error("uploadedFile undefined");
      return;
    }
    const file = uploadedFile as MirrorFile;
    removeFiles({
      indexFileIds: [file.indexFileId],
    });
  }, [uploadedFile]);

  const handleMonetizeFile = useCallback(async () => {
    if (!uploadedFile) {
      console.error("uploadedFile undefined");
      return;
    }
    const file = uploadedFile as MirrorFile;
    monetizeFile({
      indexFileId: file.indexFileId,
      currency: Currency.WMATIC,
      amount: 0.0001,
      collectLimit: 10,
    });
  }, [uploadedFile]);

  return (
    <>
      <button onClick={connect}>connect</button>
      <div className="black-text">{pkh}</div>
      {foldersMap && (
        <div className="json-view">
          <ReactJson src={foldersMap} collapsed={true} />
        </div>
      )}
      <hr />
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
      <button onClick={handleMonetizeFile}>monetizeFile</button>
      {monetizedFile && (
        <div className="json-view">
          <ReactJson src={monetizedFile} collapsed={true} />
        </div>
      )}
      <br />
      <hr />
      <button onClick={() => navigate("/")}>Go To Home Page</button>
      <button onClick={() => navigate("/folder")}>Go To Folder Page</button>
      <br />
    </>
  );
};
