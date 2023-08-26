import React, {  useState, useRef,useEffect, useContext } from 'react'
import { Container, Row, Button } from 'reactstrap'
import {  Link, useNavigate } from 'react-router-dom'
import Logo from '../../assets/images/logo.png'
import "./header.css"
import { AuthContext } from '../../context/AuthContext'
import Avatars from '../../assets/images/avatars.png'
import Avatar from '../../assets/images/avatar.png'
import { BASE_URL } from '../../utils/config'

const Header = () => {
   const {user,accessToken,dispatch}=useContext(AuthContext)
   const headerRef = useRef(null)
   const navigate = useNavigate()
   const [avatarUrl, setAvatarUrl] = useState('');
   const [isavatar,setIsAvatar]=useState()
   const [chatNumber,setChatNumber]=useState(0)
   useEffect(() => {
      const getAvatar=async()=>{
         try{         
            const res=await fetch(`${BASE_URL}/profile/download-avatar?id=${user}&token=${accessToken}`)
            if(!res.ok){
               setIsAvatar(false)
            }else{
               setIsAvatar(true)
               const blob=await res.blob()
               const url=URL.createObjectURL(blob)
               setAvatarUrl(url)
            }
            //console.log(avatarUrl)
            //credentials=JSON.stringify(data)
         }catch(err){
            console.log(err)
         }
      }
      getAvatar()
   }, [user]);
   useEffect(()=>{
      const getChatInfo=async()=>{
         try{
            const res=await fetch(`${BASE_URL}/chat/chatInfo?receiver=${user}`)
            const {data}=await res.json()
            let number=0
            if(data[0]){
               const chats=JSON.parse(localStorage.getItem("chats"))
               if(chats){ 
                  let newChat=chats
                  for(let i=0;i<data.length;i++){
                     for(let j=0;j<chats.length;j++){
                        if(data[i].sender===chats[j].receiver&&data[i].rideId===chats[j].rideId){
                           let updatedMessage={}
                           for(let k=0;k<data[i].messages.length;k++){
                              updatedMessage.text=data[i].messages[k]
                              updatedMessage.sender=data[i].sender
                              updatedMessage.receiver=data[i].receiver
                              updatedMessage.rideId=data[i].rideId
                              updatedMessage.date=new Date()
                              newChat[j].messages=[...newChat[j].messages,updatedMessage]
                           }
                           newChat[j].new=true
                           break
                        }else{
                           let updatedMessage={}
                           for(let k=0;k<data[i].messages.length;k++){
                              updatedMessage.text=data[i].messages[k]
                              updatedMessage.sender=data[i].sender
                              updatedMessage.receiver=data[i].receiver
                              updatedMessage.rideId=data[i].rideId
                              updatedMessage.date=new Date()
                              data[i].messages[k]=updatedMessage
                           }
                           newChat=[...newChat,data[i]]
                           newChat[newChat.length-1].new=true
                        }
                        
                     }
                  }
                  localStorage.setItem("chats",JSON.stringify(newChat))
                  const chatForNumber=JSON.parse(localStorage.getItem("chats"))
                  for(let i=0;i<chatForNumber.length;i++){
                     if(chatForNumber[i].new===true){
                        number++
                     }
                  }
                  setChatNumber(number)
                  await fetch(`${BASE_URL}/chat/clearChat?receiver=${user}`)
               }else{
                  for(let i=0;i<data.length;i++){
                     let updatedMessage={}
                     for(let k=0;k<data[i].messages.length;k++){
                        updatedMessage.text=data[i].messages[k]
                        updatedMessage.sender=data[i].sender
                        updatedMessage.receiver=data[i].receiver
                        updatedMessage.rideId=data[i].rideId
                        updatedMessage.date=new Date()
                        data[i].messages[k]=updatedMessage
                        
                     }
                     const swap=data[i].sender
                     data[i].sender=data[i].receiver
                     data[i].receiver=swap
                     data[i].new=true
                  }
                  localStorage.setItem("chats",JSON.stringify(data))
                  const chatForNumber=JSON.parse(localStorage.getItem("chats"))
                  for(let i=0;i<chatForNumber.length;i++){
                     if(chatForNumber[i].new===true){
                        number++
                     }
                  }
                  setChatNumber(number)
                  await fetch(`${BASE_URL}/chat/clearChat?receiver=${user}`)
               }
            }
           
            
         }catch(err){
            console.log((err))
         }
      }
      //  setInterval(() => {
         getChatInfo()
      //  }, 20000);
   },[])
   
   console.log(avatarUrl)


   const handleClick=()=>{
      navigate('/profile/menu')
   }
   const logout = async() => {
         dispatch({ type: 'LOGOUT' })
         navigate('/')
   }
   const getChatCards =()=>{
      setChatNumber(0)
      navigate('/chatcards')
   }
   const dropdownRef = useRef(null);
   const [isActive, setIsActive] = useState(false);
   const onClick = () => setIsActive(!isActive);
   return (
      <header className='header items-center' ref={headerRef}>
         <Container>
            <Row>
               <div className="nav__wrapper d-flex align-items-center justify-content-between m-3 items-center"  >
                  <div className="logo" >
                     <Link to='/home'><img src={Logo} alt="" /></Link>
                  </div>

                  <div className="nav__right d-flex align-items-center gap-4">
                     <div className="nav__btns d-flex align-items-center gap-2">
                     <Button className='btn secondary__btn'><Link to='/searchcarsharing'><span><i className='ri-search-line'></i></span> Search</Link></Button>
                     {
                     !user?<>
                              <Button className='btn secondary__btn items-center'><Link to='/login/emailpassword'><span><i className='ri-map-pin-add-line'></i></span> Publish a ride</Link></Button>
                              <div className="relative">
                                 <button onClick={onClick} className="menu-trigger p-0 m-0">
                                    <img
                                    src={Avatar}
                                    className="w-12 rounded-full"
                                    alt="Avatar"/>
                                 </button>
                                 <nav ref={dropdownRef} className={`menu ${isActive ? 'active' : 'inactive'}`}>
                                 <ul>
                                    <li className=' font-medium text-lg hover:bg-slate-200' onClick={()=>setIsActive(false)}>
                                       <a href="/login/emailpassword">Login</a>
                                    </li>
                                    <li className=' font-medium text-lg hover:bg-slate-200' onClick={()=>setIsActive(false)}><a href="/register/email">Register</a></li>
                                 </ul>
                                 </nav>
                              </div>
                           </> : <>
                              <Button className='btn secondary__btn items-center'><Link to='/ride/pickup'><span><i className='ri-map-pin-add-line'></i></span> Publish a ride</Link></Button>
                              <div className="relative">
                                 {isavatar? <button onClick={onClick} className="menu-trigger p-0 m-0">
                                                <img
                                                src={avatarUrl}
                                                className="w-12 rounded-full"
                                                alt="Avatar"/>
                                             </button> : <button onClick={onClick} className="menu-trigger p-0 m-0">
                                                <img
                                                src={Avatars}
                                                className="w-12 rounded-full"
                                                alt="Avatar"/>
                                             </button>}
                                 <nav ref={dropdownRef} className={`menu ${isActive ? 'active' : 'inactive'}`}>
                                    <ul>
                                       <li className='flex text-center text-lg font-medium hover:bg-slate-200' onClick={()=>setIsActive(false)}>
                                          <svg className="w-6 h-6 mt-auto mb-auto ml-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 20">
                                             <path d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z"/>
                                          </svg>
                                          <a href="/myrides">Your rides</a>
                                       </li>
                                       <li className='flex text-center text-lg font-medium hover:bg-slate-200 items-center' onClick={()=>setIsActive(false)}>
                                          <svg xmlns="http://www.w3.org/2000/svg" className='ml-3' width="30" height="32" viewBox="0 0 32 32" id="message"><g data-name="1"><path d="M24 7H8a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h1v4a1 1 0 0 0 1.61.79L16.77 23H24a3 3 0 0 0 3-3V10a3 3 0 0 0-3-3Zm1 13a1 1 0 0 1-1 1h-7.57a1 1 0 0 0-.61.21L11 25v-3a1 1 0 0 0-1-1H8a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1Z"></path><path d="M11 14h6a1 1 0 0 0 0-2h-6a1 1 0 0 0 0 2zm10 2H11a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2z"></path></g></svg>
                                          {chatNumber!==0&&<label class=" items-center  rounded-full bg-red-700 w-[25px] h-[25px] -ml-3 -mt-5  font-medium text-white ">{chatNumber}</label>}
                                          <button onClick={getChatCards}>Inbox</button>
                                       </li>
                                       <li className="flex font-medium text-lg hover:bg-slate-200" onClick={()=>setIsActive(false)}>
                                          <svg className="mt-auto mb-auto ml-4 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                          <button  onClick={handleClick}>Profile</button>
                                       </li>
                                       <li className="flex font-medium text-lg hover:bg-slate-200" onClick={()=>setIsActive(false)}>
                                          <svg className="mt-auto mb-auto ml-4 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                          <button onClick={logout} className="flex items-center transform transition-colors duration-200 border-r-4 border-transparent">Logout</button>
                                       </li>
                                    </ul>
                                 </nav>
                              </div>
                           </>
                        }
                        {/* <Button className='btn secondary__btn'><Link to='/login'>Login</Link></Button>
                        <Button className='btn primary__btn'><Link to='/register'>Register</Link></Button> */}
                     </div>
                  </div>
               </div>
            </Row>
         </Container>
      </header>
   )
}

export default Header