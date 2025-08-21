import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import ProfileImage from './ProfileImage'
import TrimText from '../helpers/TrimText'
import TimeAgo from 'react-timeago'

const MessageListItem = ({ conversation }) => {
  const onlineUsers = useSelector(state => state?.user?.onlineUsers)
  const currentUserId = useSelector(state => state?.user?.currentUser?._id)

  // Find the other participant (not the logged-in user)
  const otherUser = conversation?.participants?.find(
    (user) => user?._id !== currentUserId
  )

  return (
    <Link to={`/messages/${conversation?.participants[0]?._id}`} className='messageList__item'>
      <ProfileImage
        image={conversation?.participants[0].profilePhoto}
        className={onlineUsers?.includes(otherUser?._id) ? 'active' : ''}
      />
      <div className='messageList__item-details'>
        <h5>{otherUser?.fullName}</h5>
        <p>
          <TrimText item={conversation?.lastMessage?.text} maxLength={16} />
        </p>
        <small>
          <TimeAgo date={conversation?.lastMessage?.createdAt || conversation?.createdAt} />
        </small>
      </div>
    </Link>
  )
}

export default MessageListItem
