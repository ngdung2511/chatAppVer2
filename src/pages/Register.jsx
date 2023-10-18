import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
function Register() {
  const navigate = useNavigate();
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      // create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
          } catch (err) {
            console.log(err);
          }
        });
      });
    } catch (error) {
      let errorMessage = error.message;
      const pattern = /\(([^)]+)\)/;
      const matches = pattern.exec(errorMessage);
      errorMessage = matches[1].replace("auth/", "");
      setErr(errorMessage);
    }
  };

  return (
    <div className="container flex items-center justify-center mx-auto  h-screen w-screen p-4">
      <form
        onSubmit={handleSubmit}
        className="form-control p-6 bg-black rounded-2xl w-[360px] md:w-[500px]"
      >
        <div className="text-center lg:text-left">
          <h1 className="text-3xl font-bold">SwiftChat👋🏻</h1>
        </div>
        <label className="label">
          <span className="label-text">Username</span>
        </label>
        <input
          required
          type="text"
          placeholder="Username*"
          className="input input-bordered"
        />
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          required
          type="text"
          placeholder="Email*"
          className="input input-bordered"
        />
        <label className="label">
          <span className="label-text">Password</span>
        </label>
        <input
          required
          type="text"
          placeholder="Password*"
          className="input input-bordered"
        />
        <label className="label">
          <span className="label-text">Avatar</span>
        </label>
        <input
          required
          type="file"
          className="file-input file-input-bordered w-full max-w-xs"
        />
        <span className="text-red-600 mt-2">{err}</span>
        <button type="submit" className="btn mt-6">
          Sign up
        </button>
      </form>
    </div>
  );
}

export default Register;
