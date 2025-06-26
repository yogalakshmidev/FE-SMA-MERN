import React,{useState} from 'react'
import {useNavigate,Link} from 'react-router-dom'
import {FaEye,FaEyeSlash} from 'react-icons/fa'
import axios from 'axios'
import {useDispatch} from 'react-redux'
import {userActions} from '../store/user-slice'

const Login = () => {
  
    const [userData,setUserData] = useState({email: "", password: ""})
    const [error,setError] = useState("")
    const[showPassword,setShowPassword] = useState(false);
  const dispatch = useDispatch()
    const navigate = useNavigate()

    const changeInputHandler = (e)=>{
      setUserData(prevState=>({...prevState,[e.target.name]:e.target.value}))
    }

    const loginUser = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`,userData)
        console.log("Response data is",response)

        if(response.status == 200){
          dispatch(userActions.changeCurrentUser(response?.data))
          localStorage.setItem("current User",JSON.stringify(response?.data))
          navigate('/')
        }
        
      } catch (err) {
        setError(err.response?.data?.message)
      } 
    }
     
//  console.log("User details are",userData)
    return (
      <section className='register'>
        <div className='container register__container'>
          <h2>Login
            <form onSubmit = {loginUser}>
        {error && <p className = "form__error-message">{error}</p>}
        
        <input type = "text" name = "email" placeholder="Email" onChange = {changeInputHandler} />
        <div className='password__controller'>
      <input type = {showPassword? "text":"password"} name='password' placeholder='Password' onChange={changeInputHandler} />
<span onClick={()=>setShowPassword(!showPassword)}>{showPassword? <FaEyeSlash />:<FaEye />}</span>
          </div>

<p>Don't have an account?<Link to='/register'>Sign Up</Link></p>
        
<button type = 'submit' className = 'btn primary'>Login</button>

            </form>
          </h2>
          </div>
          </section>
  )
}

export default Login