import React, { useState } from 'react'
import './CSS/Loginsignup.css'

const LoginSignup = () => {
  const[state,setState]=useState("Login")
  const[formData,setFormData]=useState({
    username:'',
    password:'',
    email:'',
  })

  const loginUser=async()=>{
    let responseData
    await fetch('https://ecommerce-lcw5.onrender.com/login',{
      method:'POST',
      headers:{
        Accept:'application/form-data',
        'Content-Type':'application/json'
      },
      body:JSON.stringify(formData)
    })
    .then((res)=>res.json())
    .then((resdata)=> responseData=resdata)

    if(responseData.success){
      localStorage.setItem('auth-token',responseData.token)
      window.location.replace('/')
    }
    else{
      alert(responseData.errors)
    }
  }

  const signupUser=async()=>{
    let responseData
    await fetch('https://ecommerce-lcw5.onrender.com/signup',{
      method:'POST',
      headers:{
        Accept:'application/form-data',
        'Content-Type':'application/json'
      },
      body:JSON.stringify(formData)
    })
    .then((res)=>res.json())
    .then((resdata)=> responseData=resdata)

    if(responseData.success){
      localStorage.setItem('auth-token',responseData.token)
      window.location.replace('/')
    }
    else{
      alert(responseData.errors)
    }
  }

  const inputHandler=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }


  return (
    <div className='loginsignup'>
      <div className="loginsignup-con">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state==="Sign Up" ?<input onChange={inputHandler} type="text" value={formData.username} placeholder='Your Name' name="username" />:<></>}
          <input onChange={inputHandler} value={formData.email} type="email" placeholder='Email Address' name="email" />
          <input value={formData.password} onChange={inputHandler} type="password" placeholder='password' name="password" />
        </div>
        <button onClick={()=> {state==='Login'?loginUser():signupUser()}}>Continue</button>
        {state==='Sign Up'?
        <p className="loginsignup-login">Already have an account? <span onClick={()=> {setState('Login')}}>Login here</span></p>:
        <p className="loginsignup-login">Create an account? <span onClick={()=> {setState('Sign Up')}}>Click here</span></p>
        }
        <div className="loginsignup-agree">
          <input type="checkbox" name='' id=''/>
          <p>By continuing, i agree to the terms and privacy polocy</p>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup