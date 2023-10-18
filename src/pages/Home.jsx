import { useState } from "react";
import ChatUI from "../components/ChatUI";
import Sidebar from "../components/Sidebar";

function Home() {
  const [showCarousel, setShowCarousel] = useState(false);
  return (
    <div className="container flex items-center w-screen h-screen mx-auto">
      {!showCarousel && (
        <>
          <Sidebar />
          <ChatUI
            showCarousel={showCarousel}
            setShowCarousel={setShowCarousel}
          />
        </>
      )}
    </div>
  );
}

export default Home;
