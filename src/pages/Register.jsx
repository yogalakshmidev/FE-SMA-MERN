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
      setUserData(prevState => ({...prevState,[e.target.name]:e.target.value}))
    }

    const registerUser = async (e) => {
      e.preventDefault();
       if (userData.password !== userData.confirmPassword) {
    setError("Passwords do not match");
    return;
  }
     try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/users/register`,
      {
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword, 
      }
    );

    if (response.status === 201) {
      alert("🎉 Registration successful! Please login to continue.");
      navigate("/login");
    }
  } catch (err) {
    console.log("Register error:", err.response?.data);
    setError(err.response?.data?.message || "Something went wrong");
  }
};

    return (
      <section className='register'>
        <div className='container register__container'>
          <h2>Sign Up</h2>
            <form onSubmit = {registerUser}>
        {error && <p className = "form__error-message">{error}</p>}
         <input type = "text" name = "fullName" placeholder="Full Name" onChange = {changeInputHandler} autoFocus/>
        <input type = "text" name = "email" placeholder="Email" onChange = {changeInputHandler} />
        <div className='password__controller'>
      <input type = {showPassword? "text":"password"} name='password' placeholder='Password' onChange={changeInputHandler} />
<span onClick={()=>setShowPassword(!showPassword)}>{showPassword? <FaEyeSlash />:<FaEye />}</span>
          </div>

    <div className='password__controller'>
      <input type = {showPassword? "text":"password"} name='confirmPassword' placeholder='Confirm Password' onChange={changeInputHandler} />
<span onClick={()=>setShowPassword(!showPassword)}>{showPassword? <FaEyeSlash />:<FaEye />}</span>
          </div>
<p>Already have an account?<Link to='/login'>Sign In</Link></p>
        
<button type = 'submit' className = 'btn primary'>Register</button>

            </form>
          
          </div>
          </section>
  )
}

export default Register