import { useChatStore } from "../store/useChatStore";
import { FormEvent, useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { MessagingManager } from "../lib/WebSoketClient";
import { Send } from "lucide-react";


const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    setMessages
  } = useChatStore() as any;
  const { authUser } = useAuthStore() as any;
  const messageEndRef = useRef(null);
  const [text,setText] = useState<string>("");

  useEffect(() => {
    if (selectedUser?.id) {
      const messagingManager = MessagingManager.getInstance(selectedUser.id,setMessages);
      
      try {
        getMessages(selectedUser.id);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
     
      
  
      return () => {
        try {
          MessagingManager.destroy();
        } catch (error) {
          console.error('Failed to destroy messaging manager:', error);
        }
      };
    }
  }, [selectedUser?.id]);

  const handleSendMessage = (event:FormEvent<HTMLFormElement>)=>
    {
      event.preventDefault()
    const instance =  MessagingManager.getInstance(selectedUser.id,setMessages)
    instance.sendMessage(
      {
        "message":text,
        "reciever":selectedUser.email,
        "email":authUser.email
      }
     
    )
    setText("")


    }
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <div className="p-4 w-full">
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <input
          type="text"
          className="w-full input input-bordered rounded-lg input-sm sm:input-md"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim()}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message:any) => (
          <div
            key={message.id}
            className={`chat ${message.sender === authUser.id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.sender === authUser.id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.time_stamp)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.message && <p>{message.message}</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 w-full">
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <input
          type="text"
          className="w-full input input-bordered rounded-lg input-sm sm:input-md"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim()}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
    </div>
  );
};
export default ChatContainer;