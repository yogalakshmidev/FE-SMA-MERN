import React, { useEffect, useState } from 'react'
import { IoMdSend } from 'react-icons/io'
import ProfileImage from '../components/ProfileImage'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import {userActions} from '../store/user-slice'
import MessagesList from '../pages/MessageList'
import MessageItem from '../components/MessageItem'
import { useRef } from 'react'

const Messages = () => {
  const {receiverId}= useParams()
  const [messages,setMessages] = useState([])
  const [otherMessager,setOtherMessager] = useState({})
  const [messageBody,setMessageBody] = useState('')
  const [conversationId,setConversationId] = useState('')
  const messageEndRef = useRef()

  const token = useSelector(state => state?.user?.currentUser?.token)

  // get other user details
const getOtherMessager = async () =>{
  const response =  await axios.get(`${import.meta.env.VITE_API_URL}/users/${receiverId}`,{withCredentials: true ,  headers: {Authorization: `Bearer ${token}`}})
  setOtherMessager(response?.data)

  console.log("response from other user in messages",response?.data)
}
  useEffect(()=>{
    messageEndRef?.current?.scrollIntoView()
},[messages])


// get messages
const getMessages = async () =>{
 try { 
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/messages/${receiverId}`,{withCredentials: true , headers: {Authorization: `Bearer ${token}`}})

  setMessages(response?.data)
  setConversationId(response?.data?.[0]?.conversationId)
  
 } catch (error) {
 console.log(error)
 } 
}


  const socket = useSelector(state => state?.user?.socket)

// send messages
  const sendMessage = async(e) =>{
    e.preventDefault()
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/messages/${receiverId}`,{messageBody},{withCredentials: true, headers: {Authorization:`Bearer ${token}`}})
      setMessages(prevMessages =>[...prevMessages,response?.data])
      setMessageBody('')
    } catch (error) {
      console.log(error)
    }
  }

const dispatch = useDispatch()
const conversations = useSelector(state => state?.user?.conversations)

  useEffect(()=>{
  socket?.on("newMessage",(message) =>{
    setMessages(prevMessages => [...prevMessages,message])
      dispatch(userActions?.setConversations(conversations.map(conversation =>{
        if(conversation?._id == conversationId) {
          return {...conversation,lastMessage:{...conversation.lastMessage,seen:true}}
        }
      })))
    return ()=> socket.off("newMessage")
  })

},[socket,messages])

  useEffect(()=>{
    getMessages()
    getOtherMessager()
  },[receiverId])
  return (
    <>
   { <section className='messagesBox'>
      <header className='messagesBox__header'>
    <ProfileImage image = {otherMessager?.profilePhoto} />
    <div className='messagesBox__header-info'>
      <h4>{otherMessager?.fullName}</h4>
      <small>Last seen 2 mins ago</small>
    </div>
      </header>
      <ul className='messagesBox__messages'>
        {
          messages?.map(message => <MessageItem message = {message}/>)
        }
        <div ref={messageEndRef}></div>
        </ul>
        <form onSubmit={sendMessage}>
          <input type='text' value={messageBody} onChange={({target}) => setMessageBody(target.value)} placeholder='Enter Message....' autoFocus />

          <button type='submit'><IoMdSend /></button>
        </form>
      
    </section>}
    </>
  )
}

export default Messages