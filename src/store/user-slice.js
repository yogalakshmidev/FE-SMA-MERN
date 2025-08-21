import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
    socket: null,
    onlineUsers: [],
    conversations: []
  },
  reducers: {
    changeCurrentUser: (state, action) => {
      state.currentUser = action.payload
      localStorage.setItem("currentUser", JSON.stringify(state.currentUser))
    },
    updateProfilePhoto: (state, action) => {
      if (state.currentUser) {
        state.currentUser.profilePhoto = action.payload
        localStorage.setItem("currentUser", JSON.stringify(state.currentUser))
      }
    },
    updateUserDetails: (state, action) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload }
        localStorage.setItem("currentUser", JSON.stringify(state.currentUser))
      }
    },
    setSocket: (state, action) => { state.socket = action.payload },
    setOnlineUsers: (state, action) => { state.onlineUsers = action.payload },
    setConversations: (state, action) => { state.conversations = action.payload },
  }
})

export const {
  changeCurrentUser,
  updateProfilePhoto,
  updateUserDetails,
  setSocket,
  setOnlineUsers,
  setConversations
} = userSlice.actions


export const userActions = userSlice.actions;

export default userSlice.reducer   

