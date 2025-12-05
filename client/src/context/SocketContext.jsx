import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { createContext ,useContext, useRef } from "react";
import {io} from 'socket.io-client'
import { useEffect } from "react";

const SocketContext = createContext(null)

export const useSocket = () => {
    return useContext(SocketContext)
}
export const SocketProvider = ({ children }) => {
    const socket = useRef()
    const {userInfo} = useAppStore()
    useEffect(() => {
        if (userInfo) {
           socket.current = io(HOST, {
               query: { userId: userInfo.id },
               withCredentials: true,
               transports: ["websocket"],           // force WS only
               autoConnect: true,
            });

            socket.current.on('connect', () => {
                console.log('connected to socket server')
            })

          const handleRecieveMessage = (message) => {
            const {selectedChatData ,selectedChatType ,addMessage, selectedChatMessages,addContactsInDmContacts} = useAppStore.getState()
           
            if (selectedChatType !== undefined &&
              (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)
            ){
               // console.log(message)
                addMessage(message)
                console.log(selectedChatMessages)
            }
            addContactsInDmContacts()
          }
          const handleRecieveChannelMessage = (message) => {
              const {selectedChatData ,selectedChatType,addMessage,addChannelInChannelList} = useAppStore.getState()
              if (selectedChatType !== undefined || selectedChatData._id === message.channelId) {
                addMessage(message)
              }
              addChannelInChannelList(message)
          }

          socket.current.on('recieve-channel-message', handleRecieveChannelMessage)

          socket.current.on("recieveMessage" ,handleRecieveMessage)

            return () =>{
                socket.current.disconnect()
            }
    
        }
    },[userInfo])
    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )
}