import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const AuthWrapper = ({children}:{children:React.ReactNode}) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
   const {setUserDetails,} = useAuthStore() as any;
   useEffect(()=>{
    if(!token)
         {
            navigate('/login')
         }
        else{
          setUserDetails(token)
          //  changeCheckingAuth()
        }
  },[])


  return (
    <>
    {children}
    </>
  )
}

export default AuthWrapper