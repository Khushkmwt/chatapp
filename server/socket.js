import {Server as SocketIoServer} from 'socket.io'
import Message from './models/MessagesModel.js'
import Channel from './models/ChannelModel.js'

const setupSocket = (server) =>{
   const io = new SocketIoServer(server ,{
    cors: {
        origin: process.env.ORIGIN,
        methods: ["GET", "POST"],
        credentials: true
    }
   })
   const userSocketMap = new Map()

   const disconnect = (socket) => {
    console.log(`Client disconnected: ${socket.id}`)
    for(const [userId ,socketId] of userSocketMap.entries()){
        if(socketId === socket.id){
            userSocketMap.delete(userId)
            break
        }
    }
   }

   const sendMessages = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender)
    const recipientSocketId = userSocketMap.get(message.recipient)
    const createdMessage = await Message.create(message)
    const Id = createdMessage._id.toString();
    const messageData = await Message.findById(Id)
    .populate("sender" ,"id email firstName lastName image color")
    .populate("recipient" ,"id email firstName lastName image color")
       
    if (recipientSocketId) {
        io.to(recipientSocketId).emit("recieveMessage", messageData) 
    }
    if (senderSocketId) {
        io.to(senderSocketId).emit("recieveMessage", messageData)   
    }
   }
   //sendChannelMessages 
   const sendChannelMessages = async (message) => {
    const {channelId , sender , content ,messageType,fileUrl} = message;
    const createdMessage = await Message.create({
        sender ,
        recipient : null ,
        content ,
        messageType ,
        fileUrl ,
        timestamp: new Date(),
    })
    const messageData = await Message.findById(createdMessage._id).populate("sender","id email firstName lastName image color")
    .exec()
    await Channel.findByIdAndUpdate(channelId,{
        $push: {messages:createdMessage._id}
    })
    const channel = await Channel.findById(channelId).populate("members")
    const finalData = {...messageData._doc ,channelId:channel._id}
    if (channel && channel.members) {
        channel.members.forEach((member) =>{
            const memberSocketId = userSocketMap.get(member._id.toString())
            if (memberSocketId) {
                io.to(memberSocketId).emit("recieve-channel-message", finalData)
            }
          
        })
        const adminSocketId = userSocketMap.get(channel.admin._id.toString())
        if (adminSocketId) {
            io.to(adminSocketId).emit("recieve-channel-message", finalData)
        }
    }
   }


   io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId
    if (userId) {
        userSocketMap.set(userId, socket.id)
        console.log(`User connected: ${userId} with socket Id: ${socket.id}`)
    }else{
        console.log('User connected with no userId')
    }
    socket.on("sendMessage" , sendMessages)
    socket.on("send-channel-message", sendChannelMessages)
    socket.on('disconnect', () => disconnect(socket))
   })


}
export default setupSocket