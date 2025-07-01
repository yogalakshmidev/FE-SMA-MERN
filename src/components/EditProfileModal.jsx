import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { uiSliceActions } from '../store/ui-slice'




const EditProfileModal = () => {
  const [userData,setUserData]  = useState({fullName: "", bio: ""})
  const dispatch = useDispatch()
  const token = useSelector(state => state?.user?.currentUser?.token)
  const id = useSelector(state => state?.user?.currentUser?.id)
  
  const getUser = async () =>{
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${id}`,{withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
      // console.log("profile details ",response?.data)
      setUserData(response?.data?.user)

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getUser()
  },[])

  const closeModal = (e) =>{
if(e.target.classList.contains('editProfile')){
  dispatch(uiSliceActions.closeEditProfileModal())
}
  }

const updateUser = async() =>{
try {
  const response = await axios.patch(`${import.meta.env.VITE_API_URL}/users/edit`,userData,{withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
// console.log("response from updateProfile",response?.data?.user)
  
  
  closeModal()
} catch (error) {
  console.log(error.response.data.message)
}
}

const changeUserData = (e) =>{
  // console.log("changing user's data",e.target.value)
setUserData(prevState => {
  return {...prevState,[e.target.name]:e.target.value}
})
}
  return (
    <section className='editProfile' onClick={e => closeModal(e)}>
      <div className='editProfile__container'>
        <h3>Edit Profile</h3>
        <form onSubmit={updateUser}>
          <input type = 'text' name= 'fullName' value={userData?.fullName} onChange={changeUserData} placeholder='fullName'/>

          <textarea name='bio' value={userData?.bio} onChange={changeUserData} placeholder='Bio' />
          <button type='submit' className='btn primary'>Update</button>
        </form>
      </div>

    </section>
  )
}

export default EditProfileModal