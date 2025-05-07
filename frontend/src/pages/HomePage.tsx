import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";
import SideBar from "../components/SideBar";
import { useChatStore } from "../store/useChatStore"



const HomePage = () => {
  const {selectedUser} = useChatStore();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-40">
        <div className="bg-base-100 shadow-xl rounded-lg w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
           
           <SideBar/>
           {selectedUser ? <ChatContainer/> : <NoChatSelected/>}
          </div>

        </div>

      </div>

    </div>
  )
}

export default HomePage