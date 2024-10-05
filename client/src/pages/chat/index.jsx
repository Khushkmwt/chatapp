import { useAppStore } from '@/store'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import ChatContainer from './components/chat-container'
import ContactContainer from './components/contacts-container'
import EmptyChatContainer from './components/empty-chat-container'

const Chat = () => {
 
  const {userInfo, selectedChatType , isDownloading , isUploading , fileUploadProgress,fileDownloadProgress} = useAppStore()
  const navigate =  useNavigate()

useEffect(()=>{
    if(!userInfo.profileSetup){
      toast("Please setup profile to continue.")
      navigate('/profile')
    }
  },[userInfo,navigate])
  return (
    <div className='flex h-[100vh] text-white overflow-hidden'>
      {
        isUploading && <div className='h-[100vh] w-[100vw] z-10 top-0 fixed bg-black/80 flex justify-center items-center gap-5 flex-col backdrop-blur-lg'>
          <h5 className='text-5xl animate-pulse'> Uploading file</h5>
          { fileUploadProgress } %
        </div>
      }
       {
        isDownloading && <div className='h-[100vh] w-[100vw] z-10 top-0 fixed bg-black/80 flex justify-center items-center gap-5 flex-col backdrop-blur-lg'>
          <h5 className='text-5xl animate-pulse'> Downloading file</h5>
          { fileDownloadProgress } %
        </div>
      }
      <ContactContainer/>
      { selectedChatType === undefined ? (<EmptyChatContainer/>):(<ChatContainer/>)
      }
    </div>
  )
}

export default Chat