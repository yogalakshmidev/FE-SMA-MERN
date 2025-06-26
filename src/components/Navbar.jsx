import React,{useEffect} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {CiSearch} from 'react-icons/ci'
import ProfileImage from './ProfileImage'
import {useSelector} from 'react-redux'

const Navbar = () => {


  const userId = useSelector(state => state?.user?.currentUser?.id);
  const token = useSelector(state => state?.user?.currentUser?.token);
  const profilePhoto = useSelector(state => state?.user?.currentUser?.profilePhoto);

  const navigate = useNavigate() 

// redirect to login page if the user has no token
useEffect(()=>{
  if(!token){
    navigate('/login')
  }
},[])

// log user out after an hour
useEffect(()=>{
  setTimeout(() => {
    navigate('/logout')
  }, 1000*60*60);
},[])

  return (
    <nav className="navbar">
      <div className='container navbar__container'>
        <Link to='/' className = 'navbar__logo'>SMA-MERN</Link>
        <form className='navbar__search'>
          <input type='search' placeholder='Search' />
          <button type='submit'> <CiSearch /></button>
          </form>
<div className='navbar__right'>
  <Link to={`/users/${userId}`} className='navbar__profile'>
  <ProfileImage image={profilePhoto}/>
  </Link>
  {token? 
  <Link to='/logout'>Logout</Link>:<Link to='/login'>Login</Link>}
</div>
          </div>
          </nav>
  )
}

export default Navbar