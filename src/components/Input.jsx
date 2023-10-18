import { useContext, useEffect, useRef, useState } from "react";
import { RiAttachment2 } from "react-icons/ri";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
// lib to generate a unique id for each message
import { v4 as uuid } from "uuid";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
function Input({ isReply, setIsReply }) {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const inputRef = useRef();
  // console.log(data.repliedMessage);
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [fileName, setFileName] = useState("");
  const handlePress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };
  useEffect(() => {
    if (isReply) {
      inputRef.current.focus();
    }
  }, [isReply]);
  useEffect(() => {
    if (data.repliedMessage) {
      setIsReply(true);
    }
  }, [data.repliedMessage, setIsReply]);
  const handleSend = async () => {
    if (!text && !img) return;
    if (img) {
      //Create a unique file name
      const storageRef = ref(storage, uuid());
      await uploadBytesResumable(storageRef, img).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            if (isReply) {
              await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                  senderId: currentUser.uid,
                  text,
                  messageId: uuid(),
                  date: Timestamp.now(),
                  img: downloadURL,
                  replyTo: data.repliedMessage.text,
                  replyToId: data.repliedMessage.messageId,
                }),
              });
            } else
              await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                  senderId: currentUser.uid,
                  text,
                  messageId: uuid(),
                  date: Timestamp.now(),
                  img: downloadURL,
                }),
              });
          } catch (err) {
            console.log(err);
          }
        });
      });
    } else {
      if (isReply) {
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            senderId: currentUser.uid,
            text,
            messageId: uuid(),
            date: Timestamp.now(),
            replyTo: data.repliedMessage.text,
            replyToId: data.repliedMessage.messageId,
          }),
        });
      } else
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            senderId: currentUser.uid,
            text,
            messageId: uuid(),
            date: Timestamp.now(),
          }),
        });
    }
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
        senderId: currentUser.uid,
        readStatus: "unread",
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
        senderId: currentUser.uid,
        readStatus: "unread",
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });
    setIsReply(false);
    setImg(null);
    setText("");
  };
  return (
    <div className="relative flex items-center flex-grow-0 w-full h-16 p-2">
      {fileName && (
        <p
          onClick={() => {
            setFileName("");
            setImg(null);
          }}
          className="absolute top-[-30px] left-[10px] px-2 py-1 rounded-md bg-slate-200 cursor-pointer transition hover:bg-rose-500 text-black"
        >
          {fileName}
        </p>
      )}
      <div className="bg-[#2a2c33] h-full w-full p-2 flex items-center">
        <input
          ref={inputRef}
          placeholder="Enter message"
          className="w-full focus:outline-none bg-[#2a2c33]"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => handlePress(e)}
        />
        <input
          accept="image/*"
          id="file-input"
          type="file"
          hidden
          onChange={(e) => {
            setImg(e.target.files[0]);
            setFileName(e.target.files[0].name);
          }}
        />
        <label htmlFor="file-input">
          <RiAttachment2 className="text-2xl cursor-pointer" />
        </label>
      </div>
      <button onClick={handleSend} className="rounded-l-none btn no-animation">
        Send
      </button>
    </div>
  );
}

export default Input;
