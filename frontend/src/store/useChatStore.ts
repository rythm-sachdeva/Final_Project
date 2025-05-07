import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useChatStore = create((set)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,

    getUsers: async ()=>{
      
      set({isUsersLoading:true});
      
      try {
        // const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/`);
        set({users:res.data});

      } catch (error) {
        console.log(error)
        toast.error("Failed to get users");
      }
      finally{
        set({isUsersLoading:false});
      }

    },
    getMessages: async (senderId:any)=>{
      const token = localStorage.getItem("token");
      set({isMessagesLoading:true});
      try{
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/chat/${senderId}/`,{
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }})
          set({messages:res.data});
        }
          catch (error) { 
            console.log(error)
            toast.error("Failed to get messages");
          }
          finally{
            set({isMessagesLoading:false});
          }

      },
      setSelectedUser: (user:any)=>{
        set({selectedUser:user})
      },
      setMessages:(message:any)=>{
         set((state:any)=>({
          messages:[...state.messages,message]
         }))
      }
}))