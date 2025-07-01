import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import axios from 'axios'
import FriendRequest from './FriendRequest'


const FriendRequests = () => {

  const [friends,setFriends] = useState([])
  const userId = useSelector(state => state?.user?.currentUser?.id)
  const token = useSelector(state => state?.user?.currentUser?.token)

  // get people from db
  const getFriends = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users`,{withCredentials: true, headers:{Authorization:`Bearer ${token}`}})
      

      // console.log("Response to getFriends",response?.data?.user)
      
      const people = await response?.data?.user?.filter(person =>{
        if(!person?.followers.includes(userId) && person?._id   !== userId){
          return person;
        }
      })

      // console.log("people in the friendlist",people)
      setFriends(people)

    } catch (error) {
      console.log(error)
    }
  }

useEffect(()=>{
  getFriends()
},[])

const closeFriendBadge = (id)=>{
  setFriends(friends?.filter(friend =>{
    if(friend?._id != id){
      return friend;
    }
  }))
}

  return (
    <menu className='friendRequests'>
      <h3>Suggested Friends</h3>
      {
        friends?.map(friend => <FriendRequest key={friend?._id} friend={friend} onFilterFriend={closeFriendBadge}/>)
      }
    </menu>
  )
}

export default FriendRequests