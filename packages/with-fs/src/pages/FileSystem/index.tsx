import React, { useState, useCallback, useContext } from "react";

import {
  ActionType,
  ChainId,
  Currency,
  DatatokenType,
  // DatatokenType,
  MirrorFile,
  StorageProviderName,
  StructuredFolder,
} from "@dataverse/dataverse-connector";
import {
  useApp,
  useChangeFolderBaseInfo,
  useCollectDataUnion,
  useCreateActionFile,
  useCreateBareFile,
  useCreateFolder,
  useCreateProfile,
  useDeleteDataUnion,
  useDeleteFolder,
  useLoadBareFileContent,
  useLoadCreatedDataUnions,
  useLoadFolders,
  useMoveFiles,
  useProfiles,
  usePublishDataUnion,
  useRemoveFiles,
  useStore,
  useUpdateActionFile,
  useUpdateBareFile,
} from "@dataverse/hooks";
import ReactJson from "react-json-view";
import { useNavigate } from "react-router-dom";

import { AppContext } from "../../main";

const datatokenType = DatatokenType.Profileless;
export const FileSystem = () => {
  const { modelParser } = useContext(AppContext);
  const navigate = useNavigate();
  const [profileHandle, setProfileHandle] = useState<string>();

  /**
   * @summary import from @dataverse/hooks
   */

  const { pkh, foldersMap, dataUnionsMap, profileIds } = useStore();

  const { connectApp } = useApp({
    appId: modelParser.appId,
    autoConnect: true,
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

  const { loadFolders } = useLoadFolders({
    onSuccess: result => {
      console.log("[readAllFolders]read all folders success, result:", result);
    },
  });

  const { deleteFolder, deletedFolder } = useDeleteFolder({
    onSuccess: result => {
      console.log("[deleteFolder]delete folder success, result:", result);
    },
  });

  const { createdBareFile, createBareFile } = useCreateBareFile({
    onSuccess: result => {
      console.log("[createBareFile]create bare file success, result:", result);
    },
  });

  const { fileContent: bareFileContent, loadBareFileContent } =
    useLoadBareFileContent({
      onSuccess: result => {
        console.log(
          "[readBareFileContent]read bare file content success, result:",
          result,
        );
      },
    });

  const { updatedBareFile, updateBareFile } = useUpdateBareFile({
    onSuccess: result => {
      console.log("[updateBareFile]update bare file success, result:", result);
    },
  });

  const { createdActionFile, createActionFile } = useCreateActionFile({
    onSuccess: result => {
      console.log(
        "[createActionFile]create action file success, result:",
        result,
      );
    },
  });

  const { updatedActionFile, updateActionFile } = useUpdateActionFile({
    onSuccess: result => {
      console.log(
        "[updateActionFile]update action file success, result:",
        result,
      );
    },
  });

  const { movedFiles, moveFiles } = useMoveFiles({
    onSuccess: result => {
      console.log("[moveFiles]move files success, result:", result);
    },
  });

  const { removedFiles, removeFiles } = useRemoveFiles({
    onSuccess: result => {
      console.log("[removeFiles]remove files success, result:", result);
    },
  });

  const { loadCreatedDataUnions } = useLoadCreatedDataUnions({
    onSuccess: result => {
      console.log("[readDataUnions]read data unions success, result:", result);
    },
  });

  const { publishedDataUnion, publishDataUnion } = usePublishDataUnion({
    onSuccess: result => {
      console.log(
        "[createDataUnion]create data union success, result:",
        result,
      );
    },
  });

  const { deletedDataUnion, deleteDataUnion } = useDeleteDataUnion({
    onSuccess: result => {
      console.log(
        "[deleteDataUnion]delete data union success, result:",
        result,
      );
    },
  });

  const { collectedDataUnion, collectDataUnion } = useCollectDataUnion({
    onSuccess: result => {
      console.log(
        "[collectDataUnion]collect data union success, result:",
        result,
      );
    },
  });

  const { getProfiles } = useProfiles({
    onSuccess: result => {
      console.log("[profiles]get profiles success, result:", result);
    },
  });

  const { profileId, createProfile } = useCreateProfile({
    onSuccess: result => {
      console.log("[createProfile]create profile success, result:", result);
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
      folderName: "changed",
      folderDescription: "changed description",
    });
  }, [createdFolder, changeFolderBaseInfo]);

  const handleReadAllFolders = useCallback(async () => {
    loadFolders();
  }, [loadFolders]);

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

  const handleCreateBareFile = useCallback(async () => {
    const name = StorageProviderName.Web3Storage;
    const apiKey =
      name === StorageProviderName.Web3Storage
        ? (import.meta as any).env.VITE_WEB3_STORAGE_API_KEY
        : (import.meta as any).env.VITE_LIGHTHOUSE_API_KEY;
    createBareFile({
      fileName: "example.txt",
      fileBase64: "dGVzdA==",
      encrypted: false,
      storageProvider: {
        name,
        apiKey,
      },
      dataUnionId: (publishedDataUnion as StructuredFolder)?.folderId,
    });
  }, [createdFolder, createBareFile]);

  const handleReadBareFileContent = useCallback(async () => {
    if (!createdBareFile) {
      console.error("createdBareFile undefined");
      return;
    }
    loadBareFileContent((createdBareFile as MirrorFile)?.fileId);
  }, [createdBareFile, loadBareFileContent]);

  const handleUpdateBareFile = useCallback(async () => {
    if (!createdBareFile) {
      console.error("createdBareFile undefined");
      return;
    }
    const name = StorageProviderName.Web3Storage;
    const apiKey =
      name === StorageProviderName.Web3Storage
        ? (import.meta as any).env.VITE_WEB3_STORAGE_API_KEY
        : (import.meta as any).env.VITE_LIGHTHOUSE_API_KEY;
    updateBareFile({
      fileId: (createdBareFile as MirrorFile)?.fileId,
      fileName: "updated.txt",
      fileBase64: "dXBkYXRlZA==",
      encrypted: false,
      storageProvider: {
        name,
        apiKey,
      },
    });
  }, [createdBareFile, updateBareFile]);

  const handleCreateActionFile = useCallback(async () => {
    createActionFile({
      action: {
        actionType: ActionType.LIKE,
        comment: "I like it!",
        isRelationIdEncrypted: false,
        isCommentEncrypted: false,
      },
      relationId: (createdBareFile as MirrorFile)?.fileId,
      fileName: "like",
    });
  }, [createdBareFile, createActionFile]);

  const handleUpdateActionFile = useCallback(async () => {
    if (!createdActionFile) {
      console.error("createdActionFile undefined");
      return;
    }
    updateActionFile({
      fileId: (createdActionFile as MirrorFile)?.fileId,
      isRelationIdEncrypted: true,
      isCommentEncrypted: true,
      fileName: "still like",
    });
  }, [createdActionFile, updateActionFile]);

  const handleMoveFiles = useCallback(async () => {
    if (!createdBareFile && !createdActionFile) {
      console.error("createdBareFile and createdActionFile all undefined");
      return;
    }
    if (!createdFolder) {
      console.error("createdFolder undefined, please createFolder first!");
      return;
    } else {
      console.log(
        "currentFolerId:",
        (createdFolder as StructuredFolder)?.folderId,
      );
    }
    moveFiles({
      sourceIndexFileIds: [
        (createdBareFile as MirrorFile)?.fileId,
        (createdActionFile as MirrorFile)?.fileId,
      ],
      targetFolderId: (createdFolder as StructuredFolder)?.folderId,
    });
  }, [createdBareFile, createdActionFile, createdFolder, moveFiles]);

  const handleRemoveFiles = useCallback(async () => {
    if (!createdBareFile && !createdActionFile) {
      console.error("createdBareFile and createdActionFile all undefined");
      return;
    }
    removeFiles({
      indexFileIds: [
        (createdBareFile as MirrorFile)?.fileId,
        (createdActionFile as MirrorFile)?.fileId,
      ],
    });
  }, [createdBareFile, createdActionFile, removeFiles]);

  const handleReadDataUnions = useCallback(async () => {
    loadCreatedDataUnions();
  }, [loadCreatedDataUnions]);

  const handleCreateDataUnion = useCallback(async () => {
    if (
      datatokenType !== DatatokenType.Profileless &&
      !profileId &&
      (!profileIds || profileIds.length === 0)
    ) {
      console.error("please createProfile or getProfiles first!");
      return;
    }
    publishDataUnion({
      dataUnionName: "data union",
      // contentType: { resource: StorageResource.CERAMIC, resourceId: modelId },
      // contentType: { resource: StorageResource.IPFS },
      // actionType: ActionType.LIKE,
      dataUnionVars: {
        datatokenVars: {
          type: datatokenType,
          collectModule: "LimitedFeeCollectModule",
          chainId: ChainId.Mumbai,
          ...((profileId || profileIds?.[0]) && {
            profileId: profileId || profileIds?.[0],
          }),
          collectLimit: 100,
          amount: 0.0001,
          currency: Currency.WMATIC,
        },
        resourceId: "",
        subscribeModule: "TimeSegmentSubscribeModule",
        subscribeModuleInput: {
          amount: 0.0001,
          currency: Currency.WMATIC,
          segment: "Week",
        },
      },
    });
  }, [profileId, profileIds, publishDataUnion]);

  const handleCollectDataUnion = useCallback(async () => {
    if (!publishedDataUnion) {
      console.error("publishedDataUnion undefined");
      return;
    }
    collectDataUnion((publishedDataUnion as StructuredFolder)?.folderId);
  }, [publishedDataUnion, collectDataUnion]);

  const handleDeleteDataUnion = useCallback(async () => {
    if (!publishedDataUnion) {
      console.error("publishedDataUnion undefined");
      return;
    }
    deleteDataUnion({
      dataUnionId: (publishedDataUnion as StructuredFolder)?.folderId,
    });
  }, [publishedDataUnion, deleteDataUnion]);

  const handleGetProfiles = useCallback(async () => {
    getProfiles({
      chainId: ChainId.Mumbai,
      accountAddress: pkh!,
    });
  }, [getProfiles]);

  const handleCreateProfile = useCallback(async () => {
    if (!profileHandle) {
      console.error("profileHandle undefined");
      return;
    }
    createProfile({
      chainId: ChainId.Mumbai,
      handle: profileHandle,
    });
  }, [createProfile]);

  return (
    <>
      <button onClick={connect}>connect</button>
      <div className='black-text'>{pkh}</div>
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
      {foldersMap && (
        <div className='json-view'>
          <ReactJson src={foldersMap} collapsed={true} />
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
      <button onClick={handleCreateBareFile}>createBareFile</button>
      {createdBareFile && (
        <div className='json-view'>
          <ReactJson src={createdBareFile} collapsed={true} />
        </div>
      )}
      <button onClick={handleReadBareFileContent}>readBareFileContent</button>
      {bareFileContent && (
        <div className='json-view'>
          <ReactJson src={{ bareFileContent }} collapsed={true} />
        </div>
      )}
      <button onClick={handleUpdateBareFile}>updateBareFile</button>
      {updatedBareFile && (
        <div className='json-view'>
          <ReactJson src={updatedBareFile} collapsed={true} />
        </div>
      )}
      <button onClick={handleCreateActionFile}>createActionFile</button>
      {createdActionFile && (
        <div className='json-view'>
          <ReactJson src={createdActionFile} collapsed={true} />
        </div>
      )}
      <button onClick={handleUpdateActionFile}>updateActionFile</button>
      {updatedActionFile && (
        <div className='json-view'>
          <ReactJson src={updatedActionFile} collapsed={true} />
        </div>
      )}
      <button onClick={handleMoveFiles}>moveFiles</button>
      {movedFiles && (
        <div className='json-view'>
          <ReactJson src={movedFiles} collapsed={true} />
        </div>
      )}
      <button onClick={handleRemoveFiles}>removeFiles</button>
      {removedFiles && (
        <div className='json-view'>
          <ReactJson src={removedFiles} collapsed={true} />
        </div>
      )}
      <br />
      <hr />
      <button onClick={handleReadDataUnions}>readDataUnions</button>
      {dataUnionsMap && (
        <div className='json-view'>
          <ReactJson src={dataUnionsMap} collapsed={true} />
        </div>
      )}
      <div className='red'>
        You need to have lens profile before create a dataUnion.
      </div>
      <button onClick={handleCreateDataUnion}>createDataUnion</button>
      {publishedDataUnion && (
        <div className='json-view'>
          <ReactJson src={publishedDataUnion} collapsed={true} />
        </div>
      )}
      <button onClick={handleDeleteDataUnion}>deleteDataUnion</button>
      {deletedDataUnion && (
        <div className='json-view'>
          <ReactJson src={deletedDataUnion} collapsed={true} />
        </div>
      )}
      <div className='red'>
        You need to switch another account to collect the dataUnion.
      </div>
      <button onClick={handleCollectDataUnion}>collectDataUnion</button>
      {collectedDataUnion && (
        <div className='json-view'>
          <ReactJson src={collectedDataUnion} collapsed={true} />
        </div>
      )}
      <br />
      <hr />
      <button onClick={handleGetProfiles}>getProfiles</button>
      {profileIds && (
        <div className='json-view'>
          <ReactJson src={profileIds} collapsed={true} />
        </div>
      )}
      <input
        placeholder='enter profile handle here...'
        onChange={e => setProfileHandle(e.target.value)}
      />
      <button onClick={handleCreateProfile}>createProfile</button>
      {profileId && (
        <div className='json-view'>
          <ReactJson src={{ profileId }} collapsed={true} />
        </div>
      )}
      <hr />
      <button onClick={() => navigate("/")}>Go To Home Page</button>
      <br />
    </>
  );
};
