import { doc, onSnapshot } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { db } from "../../firebase";
import { ChatContext } from "../context/ChatContext";

function Chats() {
  const { data, dispatch, updateReadStatus } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);
  const { uid } = currentUser;
  const [chats, setChats] = useState([]);

  const handleSelect = (user) => {
    if (user.uid === data.user.uid) {
      return;
    }
    const chatId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    updateReadStatus(chatId);
    dispatch({ type: "CHANGE_USER", payload: user, chatId });
  };

  useEffect(() => {
    if (uid) {
      const unsub = onSnapshot(doc(db, "userChats", uid), (doc) => {
        setChats(doc.data());
      });
      return () => unsub();
    }
  }, [uid, chats]);

  return (
    <div className="container mx-auto flex flex-col gap-y-2 max-h-[320px] overflow-y-auto cursor-pointer ">
      {chats &&
        Object.entries(chats)
          ?.sort((a, b) => b[1].date - a[1].date)
          .map((chat) => (
            <div
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-500"
              key={chat[0]}
              onClick={() => {
                handleSelect(chat[1].userInfo);
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <img
                  className="object-contain w-12 h-12 rounded-full outline outline-1"
                  src={chat[1].userInfo.photoURL}
                  alt="avatar"
                />
                <div className="hidden text-white sm:block">
                  <span className="text-2xl">
                    {chat[1].userInfo.displayName}
                  </span>
                  {chat[1].lastMessage && (
                    <p
                      className={`text-md line-clamp-1 ${
                        currentUser.uid !== chat[1].lastMessage?.senderId &&
                        chat[1].lastMessage?.readStatus === "unread"
                          ? "text-white"
                          : "text-gray-400"
                      }`}
                    >
                      {`${
                        currentUser.uid === chat[1].lastMessage?.senderId
                          ? "You:"
                          : ""
                      } ${chat[1].lastMessage?.text}`}
                    </p>
                  )}
                </div>
              </div>
              {chat[1].lastMessage?.readStatus === "unread" &&
                currentUser.uid !== chat[1].lastMessage?.senderId && (
                  <div className="badge badge-primary badge-xs"></div>
                )}
            </div>
          ))}
    </div>
  );
}

export default Chats;
