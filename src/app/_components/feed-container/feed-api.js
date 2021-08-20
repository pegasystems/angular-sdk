
/* eslint-disable sonarjs/cognitive-complexity */
const FeedApi = (pConnect) => {
  const {
    invokeRestApi,
    getCancelTokenSource,
    isRequestCanceled
  } = PCore.getRestClient();
  const appName = window.PCore.getEnvironmentInfo().getApplicationName();
  let mentionsTagsCancelTokenSource = [];

  const getPulseContext = (pulseContext) => {
    if (pulseContext && pulseContext.indexOf("DATA-PORTAL") !== -1) {
      pulseContext = `DATA-PORTAL $${appName}`;
    }
    return pulseContext;
  };

  const fetchMessages = (
    pulseContext,
    feedID,
    feedClass,
    feedFilters,
    fetchMessagesCancelTokenSource
  ) => {
    pulseContext = getPulseContext(pulseContext);
    let filterBy = "";
    if (feedFilters) {
      feedFilters.forEach((feedFilter) => {
        if (feedFilter.on) filterBy = `${filterBy}${feedFilter.id},`;
      });
      if (filterBy === "") filterBy = "ClearFilters";
    }
    const queryPayload = {
      filterForContext: pulseContext,
      feedID,
      feedClass,
      filterBy
    };

    for (let i = 0; i < fetchMessagesCancelTokenSource.length; i += 1) {
      fetchMessagesCancelTokenSource[i].cancel();
    }
    const newCancelTokenSource = getCancelTokenSource();
    fetchMessagesCancelTokenSource.push(newCancelTokenSource);

    return invokeRestApi(
      "getFeedMessages",
      {
        queryPayload,
        cancelTokenSource: newCancelTokenSource
      },
      pConnect.getContextName()
    )
      .then((response) => {
        if (response.status === 200 && response.data) {
          fetchMessagesCancelTokenSource.pop();

          const respMessageIDs = [];
          const respMessages = {};
          const feedViewResponse = response.data;
          if (response.data) {
            if (response.data.data.FeedList) {
              const feedItemList = response.data.data.FeedList.pxResults;
              if (Array.isArray(feedItemList)) {
                feedItemList.forEach((message) => {
                  message.ID = message.pzInsKey;
                  respMessageIDs.push(message.ID);
                  respMessages[message.ID] = message;
                });
              }
            }
            if (!feedFilters) {
              feedFilters = [
                { id: "All", label: "All", on: "true", disabled: false }
              ];
              if (response.data.data.FeedFilters) {
                const feedFiltersList =
                  response.data.data.FeedFilters.pxResults;
                let allFilter = "true";
                if (Array.isArray(feedFiltersList)) {
                  feedFiltersList.forEach((feedFilter) => {
                    const feedFilterItem = {
                      id: feedFilter.pyFeedSourceReference,
                      label: feedFilter.pyLabel,
                      disabled: false,
                      on: feedFilter.pySelected
                    };
                    if (!feedFilterItem.on) allFilter = false;
                    feedFilters.push(feedFilterItem);
                  });

                  feedFilters.find(
                    (feedItem) => feedItem.id === "All"
                  ).on = allFilter;
                }
              }
            }
          }
          // if filters appllied, need to reset store
          if (filterBy !== "" || !pConnect.getValue(`pulse.messageIDs`))
            pConnect.updateState({
              pulse: {
                messages: respMessages,
                messageIDs: respMessageIDs,
                feedViewResponse
              }
            });
          else
            pConnect.updateState({
              pulse: {
                messages: {
                  ...pConnect.getValue(`pulse.messages`),
                  ...respMessages
                },
                messageIDs: [
                  ...pConnect.getValue(`pulse.messageIDs`),
                  ...respMessageIDs
                ],
                feedViewResponse
              }
            });
          return feedFilters;
        }

        pConnect.reportError(
          `fetchMessages call failed ${response.status}`,
          response.data
        );
        return "";
      })
      .catch((error) => {
        if (!isRequestCanceled(error)) {
          pConnect.reportError(
            ": Error ocurred during ajax call at fetchMessages API : ",
            error.response
          );
        }
      });
  };

  const postMessage = (
    pulseContext,
    message,
    attachmentIDs,
    isReply = false
  ) => {
    pulseContext = getPulseContext(pulseContext);
    const reqBody = JSON.stringify({
      context: pulseContext,
      message,
      attachments: attachmentIDs
    });

    invokeRestApi(
      "postFeedMessages",
      { body: reqBody },
      pConnect.getContextName()
    )
      .then((response) => {
        if (response.status === 201 && response.data) {
          const messageData = response.data;
          const messageObject = {
            ID: messageData.ID,
            pzInsKey: messageData.ID,
            pyFeed: {
              pyPostedOn: messageData.postedTime,
              pyFeedTitle: messageData.postedByUser.name,
              pyCommentContext: "pzInsKey",
              pyIconType: "user",
              pyIconReference: "pi pi-case"
            },
            postedByUser: messageData.postedByUser,
            pyMessage: messageData.message,
            mentions: messageData.mentions || [],
            pyMessageViewReference: "pzPostDetails",
            pxIcon: "globe",
            tags: messageData.tags || []
          };

          if (isReply) {
            let pxResults = pConnect.getValue(".pxResults");
            if (!pxResults) pxResults = [];
            pConnect.setValue(".pxResults", [...pxResults, messageObject]);
          } else {
            messageObject.pxResults = [];
            if (pConnect.getValue(`pulse.messageIDs`)) {
              const messageIDs = pConnect.getValue(`pulse.messageIDs`);
              const messages = pConnect.getValue(`pulse.messages`);
              pConnect.updateState({
                pulse: {
                  messages: { ...messages, [messageObject.ID]: messageObject },
                  messageIDs: [messageObject.ID, ...messageIDs]
                }
              });
            } else {
              pConnect.updateState({
                pulse: {
                  messages: { [messageObject.ID]: messageObject },
                  messageIDs: [messageObject.ID]
                }
              });
            }
          }
        } else {
          pConnect.reportError(
            `postMessage call failed with status ${response.status}`,
            response
          );
        }
      })
      .catch((error) => {
        pConnect.reportError(
          ": Error ocurred during ajax call at postMessage API : ",
          error.response
        );
      });
  };

  const likeMessage = ({
    pulseContext,
    likedBy: unLiked,
    messageID,
    isReply
  }) => {
    pulseContext = getPulseContext(pulseContext);
    const routeKey = unLiked ? "unlikeFeedMessages" : "likeFeedMessages";
    const body = JSON.stringify({
      ContextClass: pulseContext
    });
    const queryPayload = {
      pulseContext
    };

    invokeRestApi(routeKey, { body, queryPayload }, pConnect.getContextName())
      .then((response) => {
        if (response.status === 200) {
          if (isReply) {
            const msg = pConnect.getValue(`pulse.messages.${messageID}`);

            const pxResults = msg.pxResults.map((reply) => {
              reply = { ...reply };
              if (reply.pzInsKey === pulseContext) {
                let updatedLikeCount = 0;
                let updatedLikedFlag = false;
                const likeCount = reply.pyLikes ? reply.pyLikes.pxLikeCount : 0;
                if (unLiked) {
                  updatedLikeCount = likeCount - 1;
                  updatedLikedFlag = false;
                } else {
                  updatedLikeCount = likeCount + 1;
                  updatedLikedFlag = true;
                }
                reply.pyLikes = {
                  pxLikeCount: updatedLikeCount,
                  pxIsLiked: updatedLikedFlag
                };
              }
              return reply;
            });

            pConnect.updateState({
              pulse: {
                messages: {
                  [messageID]: {
                    pxResults
                  }
                }
              }
            });
          } else {
            const msg = { ...pConnect.getValue(`pulse.messages.${messageID}`) };
            const likeCount = msg.pyLikes ? msg.pyLikes.pxLikeCount : 0;
            let updatedLikeCount = 0;
            let updatedLikedFlag = false;

            if (unLiked) {
              updatedLikeCount = likeCount - 1;
              updatedLikedFlag = false;
            } else {
              updatedLikeCount = likeCount + 1;
              updatedLikedFlag = true;
            }

            msg.pyLikes = {
              pxLikeCount: updatedLikeCount,
              pxIsLiked: updatedLikedFlag
            };

            pConnect.updateState({
              pulse: {
                messages: {
                  [pulseContext]: msg
                }
              }
            });
          }
        } else {
          pConnect.reportError(
            `likeMessage call failed with status ${response.status}`,
            response
          );
        }
      })
      .catch((error) => {
        pConnect.reportError(
          ": Error ocurred during ajax call at likeMessage API : ",
          error.response.data
        );
      });
  };

  const deleteMessage = (messageID, isReply, replyID) => {
    let messageKey = messageID;
    if (isReply) {
      messageKey = replyID;
    }
    const queryPayload = {
      messageID: messageKey
    };

    invokeRestApi(
      "deleteFeedMessage",
      { queryPayload },
      pConnect.getContextName()
    )
      .then((response) => {
        if (response.status === 200) {
          if (isReply) {
            const msg = pConnect.getValue(`pulse.messages.${messageID}`);
            const pxResults = msg.pxResults.filter(
              (reply) => reply.pzInsKey !== replyID
            );

            pConnect.updateState({
              pulse: {
                messages: {
                  [messageID]: {
                    pxResults
                  }
                }
              }
            });
          } else {
            const msgIDs = pConnect.getValue(`pulse.messageIDs`);
            const newMsgIDs = msgIDs.filter((msgID) => msgID !== messageID);

            const msgs = { ...pConnect.getValue(`pulse.messages`) };
            delete msgs[messageID];

            pConnect.updateState({
              pulse: {
                messageIDs: newMsgIDs,
                messages: msgs
              }
            });
          }
        } else {
          pConnect.reportError(
            `deleteMessage call failed with status ${response.status}`,
            response
          );
        }
      })
      .catch((error) => {
        pConnect.reportError(
          ": Error ocurred during ajax call at deleteMessage API : ",
          error.response
        );
      });
  };

  const getMentionSuggestions = (mentionProps) => {
    const { searchFor, mentionsType = "Users", listSize = 5 } = mentionProps;
    const pulseContext = getPulseContext(mentionProps.pulseContext);
    const queryPayload = {
      pulseContext,
      searchFor,
      mentionsType,
      listSize
    };

    for (let i = 0; i < mentionsTagsCancelTokenSource.length; i += 1) {
      mentionsTagsCancelTokenSource[i].cancel();
    }
    const newCancelTokenSource = getCancelTokenSource();
    mentionsTagsCancelTokenSource.push(newCancelTokenSource);

    return invokeRestApi(
      "getMentionSuggestions",
      {
        queryPayload,
        cancelTokenSource: newCancelTokenSource
      },
      pConnect.getContextName()
    )
      .then((response) => {
        mentionsTagsCancelTokenSource = [];
        let mentionSuggestions = [];
        if (response.status === 200 && response.data) {
          mentionSuggestions = response.data.map((mentionSuggestion) => {
            return {
              fullname: mentionSuggestion.caption,
              id: mentionSuggestion.mentionsID
            };
          });
        } else {
          pConnect.reportError(
            `Get mention suggestions call failed ${response.status}`,
            response.data
          );
        }
        return mentionSuggestions;
      })
      .catch((err) => {
        if (!isRequestCanceled(err)) {
          pConnect.reportError(
            ": Error ocurred during ajax call at getMentionSuggestions API : ",
            err.response.data
          );
        }
      });
  };

  const getTagSuggestions = (mentionProps) => {
    const { searchFor, listSize = 5 } = mentionProps;
    const queryPayload = {
      searchFor,
      listSize
    };

    for (let i = 0; i < mentionsTagsCancelTokenSource.length; i += 1) {
      mentionsTagsCancelTokenSource[i].cancel();
    }
    const newCancelTokenSource = getCancelTokenSource();
    mentionsTagsCancelTokenSource.push(newCancelTokenSource);

    return invokeRestApi(
      "getTagSuggestions",
      {
        queryPayload,
        cancelTokenSource: newCancelTokenSource
      },
      pConnect.getContextName()
    )
      .then((response) => {
        mentionsTagsCancelTokenSource = [];
        let tagSuggestions = [];
        if (response.status === 200 && response.data) {
          tagSuggestions = response.data.tags.map((tag) => `#${tag}`);
        } else {
          pConnect.reportError(
            `Get tag suggestions call failed ${response.status}`,
            response.data
          );
        }
        return tagSuggestions;
      })
      .catch((err) => {
        if (!isRequestCanceled(err)) {
          pConnect.reportError(
            ": Error ocurred during ajax call at getTagSuggestions API : ",
            err.response.data
          );
        }
      });
  };

  return {
    fetchMessages,
    postMessage,
    likeMessage,
    deleteMessage,
    getMentionSuggestions,
    getTagSuggestions
  };
};

export default FeedApi;





// /* eslint-disable sonarjs/cognitive-complexity */
// const FeedApi = (pConnect) => {
//   const {
//     invokeRestApi,
//     getCancelTokenSource,
//     isRequestCanceled
//   } = PCore.getRestClient();
//   const appName = PCore.getEnvironmentInfo().getApplicationName();
//   let mentionsTagsCancelTokenSource = [];

//   const getPulseContext = (pulseContext) => {
//     if (pulseContext && pulseContext.indexOf("DATA-PORTAL") !== -1) {
//       pulseContext = `DATA-PORTAL $${appName}`;
//     }
//     return pulseContext;
//   };

//   const fetchMessages = (pulseContext) => {
//     let filterByContext = "context";
//     if (pulseContext && pulseContext.indexOf("DATA-PORTAL") !== -1) {
//       filterByContext =
//         "context,pxMyBookmarkMessages,pxMyFollowedCasesFeed,pxMyMentionsFeed,pxMyProfileComments,pxMySpacesFeed,pxReplyToMyMessages,pxSpaceMentions";
//     }
//     pulseContext = getPulseContext(pulseContext);
//     const queryPayload = {
//       filterForContext: pulseContext,
//       filterByContext
//     };

//     invokeRestApi("getFeedMessages", { queryPayload })
//       .then((response) => {
//         if (response.status === 200 && response.data) {
//           const respMessageIDs = [];
//           const respMessages = {};
//           if (response.data.messages) {
//             response.data.messages.forEach((message) => {
//               respMessageIDs.push(message.ID);
//               respMessages[message.ID] = message;
//             });
//           }
//           pConnect.updateState({
//             pulse: {
//               messages: respMessages,
//               messageIDs: respMessageIDs
//             }
//           });
//         } else {
//           pConnect.reportError(
//             `fetchMessages call failed ${response.status}`,
//             response.data
//           );
//         }
//       })
//       .catch((error) => {
//         pConnect.reportError(
//           ": Error ocurred during ajax call at fetchMessages API : ",
//           error.response.data
//         );
//       });
//   };

//   const postMessage = (pulseContext, message, isReply = false) => {
//     // debugger;
//     pulseContext = getPulseContext(pulseContext);
//     const reqBody = JSON.stringify({
//       context: pulseContext,
//       message
//     });

//     invokeRestApi("postFeedMessages", { body: reqBody })
//       .then((response) => {
//         // debugger;
//         if (response.status === 201 && response.data) {
//           const messageData = response.data;
//           const messageObject = {
//             ID: messageData.ID,
//             postedTime: messageData.postedTime,
//             postedByUser: messageData.postedByUser,
//             message: messageData.message,
//             mentions: messageData.mentions || [],
//             tags: messageData.tags || []
//           };

//           if (isReply) {
//             // debugger;
//             const replies = pConnect.getValue(".replies");
//             if (undefined === replies) {
//               // Nebula/Constellation changed to have an Activity component that has a .replies property
//               console.log( `--> QUASAR need to fix: FeedApi: getValue(".replies"): ${replies}`);
//             } else {
//               // Quasar-specific workaround. Nebula/Constellation has Activity object with .replies prop
//               //  Note that the reply gets created and put in the db but the UI isn't properly
//               //  refreshed until we get this fixed.
//               pConnect.setValue(".replies", [...replies, messageObject]);
//             }
//           } else {
//             messageObject.replies = [];
//             const messageIDs = pConnect.getValue(`pulse.messageIDs`);
//             const messages = pConnect.getValue(`pulse.messages`);
//             pConnect.updateState({
//               pulse: {
//                 messages: { ...messages, [messageObject.ID]: messageObject },
//                 messageIDs: [messageObject.ID, ...messageIDs]
//               }
//             });
//           }
//         } else {
//           pConnect.reportError(
//             `postMessage call failed with status ${response.status}`,
//             response.data
//           );
//         }
//       })
//       .catch((error) => {
//         pConnect.reportError(
//           ": Error ocurred during ajax call at postMessage API : ",
//           error.response.data
//         );
//       });
//   };

//   const likeMessage = ({
//     pulseContext,
//     likedBy: unLiked,
//     messageID,
//     isReply
//   }) => {
//     pulseContext = getPulseContext(pulseContext);
//     const routeKey = unLiked ? "unlikeFeedMessages" : "likeFeedMessages";
//     const body = JSON.stringify({
//       ContextClass: pulseContext
//     });
//     const queryPayload = {
//       pulseContext
//     };

//     invokeRestApi(routeKey, { body, queryPayload })
//       .then((response) => {
//         if (response.status === 200) {
//           if (isReply) {
//             const msg = pConnect.getValue(`pulse.messages.${messageID}`);

//             const replies = msg.replies.map((reply) => {
//               reply = { ...reply };
//               if (reply.ID === pulseContext) {
//                 const likeCount = reply.likeCount ? +reply.likeCount : 0;
//                 if (unLiked) {
//                   reply.likeCount = likeCount - 1;
//                   reply.likedByMe = "false";
//                 } else {
//                   reply.likeCount = likeCount + 1;
//                   reply.likedByMe = "true";
//                 }
//               }
//               return reply;
//             });

//             pConnect.updateState({
//               pulse: {
//                 messages: {
//                   [messageID]: {
//                     replies
//                   }
//                 }
//               }
//             });
//           } else {
//             const msg = { ...pConnect.getValue(`pulse.messages.${messageID}`) };
//             const likeCount = msg.likeCount ? +msg.likeCount : 0;

//             if (unLiked) {
//               msg.likeCount = likeCount - 1;
//               msg.likedByMe = "false";
//             } else {
//               msg.likeCount = likeCount + 1;
//               msg.likedByMe = "true";
//             }

//             pConnect.updateState({
//               pulse: {
//                 messages: {
//                   [pulseContext]: msg
//                 }
//               }
//             });
//           }
//         } else {
//           pConnect.reportError(
//             `likeMessage call failed with status ${response.status}`,
//             response.data
//           );
//         }
//       })
//       .catch((error) => {
//         pConnect.reportError(
//           ": Error ocurred during ajax call at likeMessage API : ",
//           error.response.data
//         );
//       });
//   };

//   const deleteMessage = (messageID, isReply, replyID) => {
//     let messageKey = messageID;
//     if (isReply) {
//       messageKey = replyID;
//     }
//     const queryPayload = {
//       messageID: messageKey
//     };

//     invokeRestApi("deleteFeedMessage", { queryPayload })
//       .then((response) => {
//         if (response.status === 200) {
//           if (isReply) {
//             const msg = pConnect.getValue(`pulse.messages.${messageID}`);
//             const replies = msg.replies.filter((reply) => reply.ID !== replyID);

//             pConnect.updateState({
//               pulse: {
//                 messages: {
//                   [messageID]: {
//                     replies
//                   }
//                 }
//               }
//             });
//           } else {
//             const msgIDs = pConnect.getValue(`pulse.messageIDs`);
//             const newMsgIDs = msgIDs.filter((msgID) => msgID !== messageID);

//             const msgs = { ...pConnect.getValue(`pulse.messages`) };
//             delete msgs[messageID];

//             pConnect.updateState({
//               pulse: {
//                 messageIDs: newMsgIDs,
//                 messages: msgs
//               }
//             });
//           }
//         } else {
//           pConnect.reportError(
//             `deleteMessage call failed with status ${response.status}`,
//             response.data
//           );
//         }
//       })
//       .catch((error) => {
//         pConnect.reportError(
//           ": Error ocurred during ajax call at deleteMessage API : ",
//           error.response.data
//         );
//       });
//   };

//   const getMentionSuggestions = (mentionProps) => {
//     const { searchFor, mentionsType = "Users", listSize = 5 } = mentionProps;
//     const pulseContext = getPulseContext(mentionProps.pulseContext);
//     const queryPayload = {
//       pulseContext,
//       searchFor,
//       mentionsType,
//       listSize
//     };

//     for (let i = 0; i < mentionsTagsCancelTokenSource.length; i += 1) {
//       mentionsTagsCancelTokenSource[i].cancel();
//     }
//     const newCancelTokenSource = getCancelTokenSource();
//     mentionsTagsCancelTokenSource.push(newCancelTokenSource);

//     return invokeRestApi("getMentionSuggestions", {
//       queryPayload,
//       cancelTokenSource: newCancelTokenSource
//     })
//       .then((response) => {
//         mentionsTagsCancelTokenSource = [];
//         let mentionSuggestions = [];
//         if (response.status === 200 && response.data) {
//           mentionSuggestions = response.data.map((mentionSuggestion) => {
//             return {
//               fullname: mentionSuggestion.caption,
//               id: mentionSuggestion.mentionsID
//             };
//           });
//         } else {
//           pConnect.reportError(
//             `Get mention suggestions call failed ${response.status}`,
//             response.data
//           );
//         }
//         return mentionSuggestions;
//       })
//       .catch((err) => {
//         if (!isRequestCanceled(err)) {
//           pConnect.reportError(
//             ": Error ocurred during ajax call at getMentionSuggestions API : ",
//             err.response.data
//           );
//         }
//       });
//   };

//   const getTagSuggestions = (mentionProps) => {
//     const { searchFor, listSize = 5 } = mentionProps;
//     const queryPayload = {
//       searchFor,
//       listSize
//     };

//     for (let i = 0; i < mentionsTagsCancelTokenSource.length; i += 1) {
//       mentionsTagsCancelTokenSource[i].cancel();
//     }
//     const newCancelTokenSource = getCancelTokenSource();
//     mentionsTagsCancelTokenSource.push(newCancelTokenSource);

//     return invokeRestApi("getTagSuggestions", {
//       queryPayload,
//       cancelTokenSource: newCancelTokenSource
//     })
//       .then((response) => {
//         mentionsTagsCancelTokenSource = [];
//         let tagSuggestions = [];
//         if (response.status === 200 && response.data) {
//           tagSuggestions = response.data.tags.map((tag) => `#${tag}`);
//         } else {
//           pConnect.reportError(
//             `Get tag suggestions call failed ${response.status}`,
//             response.data
//           );
//         }
//         return tagSuggestions;
//       })
//       .catch((err) => {
//         if (!isRequestCanceled(err)) {
//           pConnect.reportError(
//             ": Error ocurred during ajax call at getTagSuggestions API : ",
//             err.response.data
//           );
//         }
//       });
//   };

//   return {
//     fetchMessages,
//     postMessage,
//     likeMessage,
//     deleteMessage,
//     getMentionSuggestions,
//     getTagSuggestions
//   };
// };

// export default FeedApi;
