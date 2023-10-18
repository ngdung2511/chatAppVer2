import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { BsReply } from "react-icons/bs";
import { FiMoreHorizontal } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
function Message({
  message,
  isReply,
  setIsReply,
  firstMessageRef,
  showCarousel,
  setShowCarousel,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { data, dispatch } = useContext(ChatContext);
  const messageRef = useRef();
  const { replyTo, text, img, senderId, replyToId, messageId } = message;

  // Get timestamp of each message
  const createdAt = message.date;
  const timestamp = createdAt ? createdAt.toMillis() : 0;
  const date = timestamp ? new Date(timestamp) : new Date();
  // Check if it is current user's UI or not
  const isCurrentUser = currentUser.uid === senderId;

  // Auto scroll into view if new message arrives
  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const handleReply = (repliedMessage) => {
    setIsReply(true);
    dispatch({ type: "REPLY", payload: repliedMessage });
  };
  const handleViewImage = () => {
    console.log("view image");
    setShowCarousel(true);
  };
  // console.log("First message:", firstMessageRef.current);

  return (
    <>
      {/* {<div className="text-center">{date.toLocaleDateString()}</div>} */}
      <div
        ref={messageRef}
        className={`chat ${isCurrentUser ? "chat-end" : "chat-start"} relative`}
      >
        {/* <div className="absolute top-0 px-2 py-4 bg-slate-600">
          this is message modal
        </div> */}
        {isCurrentUser ? (
          ""
        ) : (
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img src={data.user.photoURL} />
            </div>
          </div>
        )}

        <div
          className={`chat-header flex flex-col ${
            isCurrentUser ? "items-end" : "items-start"
          }`}
        >
          {replyTo && (
            <p className="px-4 py-2 cursor-pointer bg-slate-600 rounded-xl">
              {replyTo}
            </p>
          )}
          <time className="text-xs opacity-50">
            {`${date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`}
          </time>
        </div>
        {text && (
          <div className="relative chat-bubble">
            <span>{text}</span>
            {!isCurrentUser && (
              <>
                <div
                  onClick={() => handleReply(message)}
                  className="group absolute right-[-46px] text-xl flex items-center
              top-0 bottom-0 my-auto p-4
              cursor-pointer hover:text-white"
                >
                  <BsReply className="hidden group-hover:block" />
                </div>
              </>
            )}
          </div>
        )}

        {img && (
          <img
            onClick={() => {}}
            className="object-contain chat-bubble max-w-[320px] max-h-[320px] cursor-pointer"
            src={img}
            alt="sent img"
          />
        )}
        <div className="opacity-50 chat-footer">Delivered</div>
      </div>
    </>
  );
}

export default Message;
