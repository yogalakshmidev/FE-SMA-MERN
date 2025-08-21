import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MessageListItem from "./MessageListItem";
import axios from "axios";

const MessagesList = () => {
  const [conversations, setConversations] = useState([]);
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const socket = useSelector((state) => state?.user?.socket);

  // Get chats from database
  const getConversations = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/conversations`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );


      setConversations(response?.data?.conversations || response?.data || []);
    } catch (error) {
      console.log("Error fetching conversations:", error?.response?.data || error);
    }
  };

  useEffect(() => {
    getConversations();
  }, []); 

  
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", () => {
      getConversations();
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket]);

  return (
    <menu className="messageList">
      <h3>Recent Messages</h3>
      {conversations?.map((conversation) => (
        <MessageListItem key={conversation?._id} conversation={conversation} />
      ))}
    </menu>
  );
};

export default MessagesList;
