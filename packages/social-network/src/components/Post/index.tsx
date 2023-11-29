import React, { useState } from "react";

import { Message } from "@arco-design/web-react";
import { ActionType } from "@dataverse/dataverse-connector";
import { useApp, useStore, useCreateActionFile } from "@dataverse/hooks";
import { ModelParser, Output } from "@dataverse/model-parser";

import app from "../../../output/app.json";
import Avatar from "../Avatar";

import likeRedIcon from "@/assets/like-red.svg";
import likeIcon from "@/assets/like.svg";
import loadingIcon from "@/assets/loading.svg";
import "./index.css";
import { addressAbbreviation, getAddressFromDid, timeAgo } from "@/utils";

const modelParser = new ModelParser(app as Output);

const Post = ({ post }: { post: any }) => {
  const [commentContent, setCommentContent] = useState<string>();
  const { pkh, actionsMap: actions } = useStore();
  const { createActionFile: createLikeActionFile, isPending: isLikePending } =
    useCreateActionFile();
  const {
    createActionFile: createCommentActionFile,
    isPending: isCommentPending,
  } = useCreateActionFile({
    onError: () => {
      setCommentContent("");
    },
    onSuccess: () => {
      setCommentContent("");
    },
  });
  const commentActionList =
    actions && post && actions[post.fileContent.file.fileId]
      ? Object.values(actions[post.fileContent.file.fileId])
          .filter(
            actionFile =>
              actionFile.action.actionType === ActionType.COMMENT &&
              actionFile.action.comment,
          )
          .sort((a, b) => Date.parse(b.createdAt!) - Date.parse(a.createdAt!))
      : [];

  const { connectApp } = useApp({
    appId: modelParser.appId,
    autoConnect: true,
    onSuccess: result => {
      console.log("[connect]connect app success, result:", result);
    },
  });

  const like = (fileId: string) => {
    return createLikeActionFile({
      action: { actionType: ActionType.LIKE },
      relationId: fileId,
      fileName: "",
    });
  };

  const comment = (fileId: string) => {
    return createCommentActionFile({
      action: { actionType: ActionType.COMMENT, comment: commentContent },
      relationId: fileId,
      fileName: "",
    });
  };

  return (
    <div className='post'>
      {/* {JSON.stringify(post.fileContent)} */}
      <div className='post-content-container'>
        <div className='post-content-container-left'>
          <Avatar address={getAddressFromDid(post.pkh)} />
          <div
            className='line'
            style={{
              ...(commentActionList.length === 0 && { height: "127%" }),
            }}
          ></div>
        </div>
        <div className='post-content-container-right'>
          <div className='address'>
            {addressAbbreviation(getAddressFromDid(post.pkh))}
          </div>
          <div className='time'>
            ·{timeAgo(Date.parse(post.fileContent.file.createdAt))}
          </div>
          <div className='text'>{post.fileContent.content?.text}</div>
        </div>
      </div>

      {commentActionList.map(actionFile => (
        <div className='comment' key={actionFile.fileId}>
          <div className='comment-left'>
            <Avatar address={getAddressFromDid(actionFile.controller!)} />
            <div className='line'></div>
          </div>
          <div className='comment-right'>
            <div className='address'>
              {addressAbbreviation(getAddressFromDid(actionFile.controller!))}
            </div>
            <div className='time'>
              ·{timeAgo(Date.parse(actionFile.createdAt!))}
            </div>
            <div className='content'>{actionFile.action.comment}</div>
          </div>
        </div>
      ))}
      <div className='footer'>
        <div className='comment-container'>
          <input
            value={commentContent}
            placeholder='Comment...'
            className='comment-input'
            onChange={e => setCommentContent(e.target.value)}
          />
          <button
            className='comment-button'
            onClick={async () => {
              if (!pkh) {
                await connectApp();
              }
              if (!commentContent) {
                Message.info("Comment content cannot be empty");
                return;
              }
              comment(post.fileContent.file.fileId);
            }}
          >
            {isCommentPending && <img src={loadingIcon} />}
            comment
            {isCommentPending && <div className='placeholder'></div>}
          </button>
        </div>

        <div
          className='like'
          onClick={async () => {
            let controller = pkh;

            if (!controller) {
              const res = await connectApp();
              controller = res.pkh;
            }

            if (
              actions?.[post.fileContent.file.fileId] &&
              Object.values(actions?.[post.fileContent.file.fileId]).find(
                actionFile =>
                  actionFile.controller === controller &&
                  actionFile.action.actionType === ActionType.LIKE,
              )
            ) {
              return;
            }

            like(post.fileContent.file.fileId);
          }}
        >
          <img
            src={
              isLikePending
                ? loadingIcon
                : actions?.[post.fileContent.file.fileId] &&
                  Object.values(actions?.[post.fileContent.file.fileId]).find(
                    actionFile =>
                      actionFile.controller === pkh &&
                      actionFile.action.actionType === ActionType.LIKE,
                  )
                ? likeRedIcon
                : likeIcon
            }
            className='like'
          />
          {actions?.[post.fileContent.file.fileId] &&
            [
              ...new Set(
                Object.values(actions?.[post.fileContent.file.fileId])
                  .filter(
                    actionFile =>
                      actionFile.action.actionType === ActionType.LIKE,
                  )
                  .map(actionFile => actionFile.controller),
              ),
            ].length}
        </div>
      </div>
    </div>
  );
};

export default Post;
