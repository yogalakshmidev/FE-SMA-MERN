import React,{useState} from 'react'
import {useNavigate,Link} from 'react-router-dom'
import {FaEye,FaEyeSlash} from 'react-icons/fa'
import axios from 'axios'


const Register = () => {
  
    const [userData,setUserData] = useState({fullName: "", email: "", password: "",   confirmPassword: ""})

    const [error,setError] = useState("")
    const[showPassword,setShowPassword] = useState(false);

    const navigate = useNavigate()

    const changeInputHandler = (e)=>{
      setUserData(prevState=>({...prevState,[e.target.name]:e.target.value}))
    }

    const registerUser = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/register`,userData)
        console.log("Response data is",response)

        if(response.statusText == 'OK'){
          navigate('/login')
        }
        
      } catch (err) {
        setError(err.response?.data?.message)
      } 
    }
     
//  console.log("User details are",userData)
    return (
      <section className='register'>
        <div className='container register__container'>
          <h2>Sign Up
            <form onSubmit = {registerUser}>
        {error && <p className = "form__error-message">{error}</p>}
         <input type = "text" name = "fullName" placeholder="Full Name" onChange = {changeInputHandler} autoFocus/>
        <input type = "text" name = "email" placeholder="Email" onChange = {changeInputHandler} />
        <div className='password__controller'>
      <input type = {showPassword? "text":"password"} name='password' placeholder='Password' onChange={changeInputHandler} />
<span onClick={()=>setShowPassword(!showPassword)}>{showPassword? <FaEyeSlash />:<FaEye />}</span>
          </div>

    <div className='password__controller'>
      <input type = {showPassword? "text":"password"} name='confirmPassword' placeholder=' Confirm Password' onChange={changeInputHandler} />
<span onClick={()=>setShowPassword(!showPassword)}>{showPassword? <FaEyeSlash />:<FaEye />}</span>
          </div>
<p>Already have an account?<Link to='/login'>Sign In</Link></p>
        
<button type = 'submit' className = 'btn primary'>Register</button>

            </form>
          </h2>
          </div>
          </section>
  )
}

export default Register