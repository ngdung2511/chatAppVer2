import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { IoClose } from "react-icons/io5";
function RepliedMessage({ setIsReply }) {
  const { data } = useContext(ChatContext);
  return (
    <div className="px-2 border-t border-t-slate-600 flex items-center justify-between">
      <div className="flex flex-col">
        <p className="text-white font-semibold">{`Replying to ${data.user?.displayName}`}</p>
        <p className="text-gray-400 font-normal text-base">
          {data.repliedMessage?.text}
        </p>
      </div>
      <div
        onClick={() => {
          setIsReply(false);
        }}
        className="p-2 cursor-pointer text-2xl hover:text-white"
      >
        <IoClose />
      </div>
    </div>
  );
}

export default RepliedMessage;
