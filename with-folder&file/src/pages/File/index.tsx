import React, { useCallback, useContext } from "react";
import ReactJson from "react-json-view";
import { Currency, MirrorFile, StorageProviderName } from "@dataverse/dataverse-connector";
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

const File = () => {
  const { modelParser } = useContext(AppContext);

  /**
   * @summary import from @dataverse/hooks
   */
  const {
    pkh, folderMap
  } = useStore();

  const { connectApp } = useApp({
    onSuccess: (result) => {
      console.log("[connect]connect app success, result:", result);
    },
  });

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

  const { monetizeFile, monetizedFile } = useMonetizeFile({
    onSuccess: (result) => {
      console.log("[monetizeFile]monetize file success, result:", result);
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

  const handleUploadFile = useCallback(async () => {
    uploadFile({
      // TODO: folder id
      folderId: "",
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
      // TODO: target folder id
      targetFolderId: ""
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
    })
  }, [uploadedFile]);

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
    </>
  );
}

export default File;
