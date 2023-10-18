import { useContext, useEffect, useRef, useState } from "react";
import Message from "./Message";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import RepliedMessage from "./RepliedMessage";
function ChatUI({ showCarousel, setShowCarousel }) {
  // Store the initial message

  const { data } = useContext(ChatContext);
  const [messages, setMessages] = useState([]);
  const [isReply, setIsReply] = useState(false);

  // Get messages date based on chatId
  useEffect(() => {
    if (data.chatId) {
      const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
        if (doc.exists()) {
          setMessages(doc.data().messages);
        }
      });
      return () => unsub();
    }
  }, [data.chatId]);

  // const firstMessageRef = useRef();
  // useEffect(() => {
  //   if (messages.length > 0) {
  //     firstMessageRef.current = messages[0];
  //   }
  // }, [messages]);

  // console.log(messages);

  return data.chatId ? (
    <div className="grow h-full shrink-0">
      <div className="bg-[#1c1d25] h-full rounded-r-xl flex flex-col">
        <div className="p-3">
          <p className="text-2xl text-gray-200 font-semibold">
            {data.user.displayName}
          </p>
        </div>
        <div className="my-2 divider"></div>
        <div className="p-2 grow overflow-y-auto">
          {messages.map((message, index) => (
            <Message
              // firstMessageRef={firstMessageRef}
              isReply={isReply}
              setIsReply={setIsReply}
              message={message}
              key={index}
              showCarousel={showCarousel}
              setShowCarousel={setShowCarousel}
            />
          ))}
        </div>
        {isReply && <RepliedMessage setIsReply={setIsReply} />}
        <Input isReply={isReply} setIsReply={setIsReply} />
      </div>
    </div>
  ) : (
    <div className="text-3xl w-full text-center">
      Select a user to start chatting!
    </div>
  );
}

export default ChatUI;
