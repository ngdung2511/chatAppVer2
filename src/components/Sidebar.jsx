import Chats from "./Chats";
import Search from "./Search";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
function Sidebar() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { displayName, photoURL } = currentUser;
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex-grow-0 shrink basis-96 h-full">
      <div className="container mx-auto h-full bg-[#1e1f23] p-4 rounded-l-xl">
        <div className="flex items-center justify-between gap-10 my-2">
          <div className="flex items-center gap-2">
            <img
              className="object-contain h-12 w-12 rounded-full"
              src={photoURL}
              alt="avatar"
            />
            <p className="font-semibold text-white text-xl">{displayName}</p>
          </div>

          <button onClick={handleLogout} className="btn hidden md:block">
            Logout
          </button>
        </div>
        <Search />
        <div className="divider"></div>
        <Chats />
      </div>
    </div>
  );
}

export default Sidebar;
