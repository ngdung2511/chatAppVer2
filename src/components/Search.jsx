import { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";

function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const handleKey = (e) => {
    if (e.code == "Enter") {
      handleSearch();
    }
  };
  const handleSearch = async () => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("displayName", "==", searchQuery));
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const searchResult = doc.data();
        if (!searchResult) setSearchQuery(null);
        setUser(searchResult);
      });
    } catch (err) {
      console.log(err);
      setErr(true);
    }
  };
  const handleSelect = async () => {
    // create a unique combined id for a chat between 2 users
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    // check if the chat exists in the db, if not create it
    const res = await getDoc(doc(db, "chats", combinedId));
    if (!res.exists()) {
      await setDoc(doc(db, "chats", combinedId), {
        messages: [],
      });
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [combinedId + ".userInfo"]: {
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
        },
        [combinedId + ".date"]: serverTimestamp(),
      });
      await updateDoc(doc(db, "userChats", user.uid), {
        [combinedId + ".userInfo"]: {
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          uid: currentUser.uid,
        },
        [combinedId + ".date"]: serverTimestamp(),
      });
    }
    setUser(null);
    setSearchQuery("");
  };
  return (
    <>
      <div className="md:flex md:flex-col mt-6 gap-y-2 hidden">
        <input
          type="text"
          placeholder="Find a user"
          className="input input-bordered w-full"
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKey}
          value={searchQuery || ""}
        />
        {err && <div>User not found</div>}
        {user && (
          <div
            onClick={handleSelect}
            className="flex items-center gap-4 cursor-pointer hover:bg-gray-700 p-2 rounded-lg"
          >
            <img
              className="h-16 w-16 rounded-full object-contain"
              src={user.photoURL}
              alt="avatar"
            />
            <div className="text-white">
              <span className="text-xl">{user.displayName}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Search;
