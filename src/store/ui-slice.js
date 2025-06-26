import {createSlice} from '@reduxjs/toolkit';

localStorage.setItem( 'theme',JSON.stringify({ primaryColor: ""}))
localStorage.setItem('theme', JSON.stringify({ backgroundColor: ""}))
const initialState={
  themeModalIsOpen:false,
  editProfileModalOpen:false,
  editPostModalOpen:false,editPostId:"",
  
  //  localStorage.setItem({(primaryColor,""),(backgroundColor,"")})
   

  //  {primaryColor:"",backgroundColor:""}
  theme: JSON.parse(localStorage.getItem("theme"))||{primaryColor:"",backgroundColor:""}
}
const uiSlice = createSlice({
  name:"ui",
  initialState,
  reducers:{
    openThemeModal: state=>{
      state.themeModalIsOpen=true;
    },
    closeThemeModal: state=>{
      state.themeModalIsOpen=false;
    },
    changeTheme:(state,action)=>{
      state.theme = action.payload;
    },
    openEditProfileModal:state=>{
      state.editProfileModalOpen =  true;
    },
    closeEditProfileModal: state=>{
      state.editProfileModalOpen = false;
    },
    openEditProfileModal:(state,action)=>{
      state.editPostModalOpen = true;
      state.editPostId= action.payload;
    },
    closeEditProfileModal:state=>{
      state.editPostModalOpen = false;
    }
  }
})

export const uiSliceActions = uiSlice.actions
export default uiSlice