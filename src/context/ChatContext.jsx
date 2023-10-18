import { createContext, useReducer, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

export const ChatContext = createContext();

const INIT_STATE = {
  chatId: "",
  user: {},
};

function ChatContextProvider({ children }) {
  const chatReducer = (state, action) => {
    // let newChatId;
    switch (action.type) {
      case "CHANGE_USER":
        // newChatId =
        //   currentUser.uid > action.payload.uid
        //     ? currentUser.uid + action.payload.uid
        //     : action.payload.uid + currentUser.uid;

        return { user: action.payload, chatId: action.chatId };
      case "REPLY":
        return { ...state, repliedMessage: action.payload };

      default:
        return state;
    }
  };
  const { currentUser } = useContext(AuthContext);
  const [state, dispatch] = useReducer(chatReducer, INIT_STATE);
  const updateReadStatus = async (chatId) => {
    try {
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [`${chatId}.lastMessage.readStatus`]: "read",
      });
    } catch (error) {
      console.error("Error updating last message read status:", error);
    }
  };

  return (
    <ChatContext.Provider value={{ data: state, dispatch, updateReadStatus }}>
      {children}
    </ChatContext.Provider>
  );
}

export default ChatContextProvider;
