import React, {useState, useEffect ,useContext} from 'react';
import io from "socket.io-client";
import { useLocation ,useNavigate} from 'react-router-dom';
import './Chat.css';
import Messages from '../Messages/Messages';
import { AuthContext } from '../../../context/AuthContext';
import ScrollToBottom from 'react-scroll-to-bottom';
import { BASE_URL } from '../../../utils/config';
let socket 
const Chat = () => {
  const location=useLocation()
  const {user}=useContext(AuthContext)
  const [driverInfo, setDriverInfo] = useState({});
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [is,setIs]=useState(false)
  const [avatar,setAvatar] = useState(location.state.avatar)
  const navigate=useNavigate()
  const dateString = location.state.ride.date;
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", { weekday: 'short', day: 'numeric', month: 'long' });
  const pickup=location.state.ride.from.split(",")
  const dropoff=location.state.ride.to.split(",")
  useEffect(()=>{
    console.log("refresh")
    const getDriverInfo=async()=>{
      const res=await fetch(`${BASE_URL}/users/getDriverInfo?email=${location.state.ride.driveremail}`)
      const {driverInfo}=await res.json()
      setDriverInfo(driverInfo)
      const chats=JSON.parse(localStorage.getItem("chats"))
      if(chats){
        for(let i=0;i<chats.length;i++){
          if (location.state.receiver) {
                      if(chats[i].rideId===location.state.rideId&&chats[i].receiver===location.state.receiver){
                        setMessages(chats[i].messages)
                        break
                      }
                    }
          else if (chats[i].rideId===location.state.ride._id&&chats[i].receiver===driverInfo._id) {
                        setMessages(chats[i].messages)
                        break
                      }
          
        }
      }
      setIs(true)
    }
    getDriverInfo()
  },[])
  useEffect(()=>{
    if(location.state.receiver){
      socket=io.connect('http://localhost:5000/myNamespace',{
      query:{
        sender:user,
        receiver:location.state.receiver,
        rideId:location.state.ride._id
      }
    })
    }else{
      socket=io.connect('http://localhost:5000/myNamespace',{
        query:{
          sender:user,
          receiver:driverInfo._id,
          rideId:location.state.ride._id
        }
      });      
    }
  },[location.state.receiver, driverInfo._id])
  useEffect(()=>{
      socket.on('message',(message)=>{
        let updatedMessage=message
        updatedMessage.date=new Date()
        setMessages((prev)=>([...prev, updatedMessage]));
        if(location.state.receiver){
          let chats=JSON.parse(localStorage.getItem("chats"))
          for(let i=0;i<chats.length;i++){
            if(chats[i].rideId===location.state.rideId&&chats[i].receiver===location.state.receiver){
              chats[i].messages=[...chats[i].messages,updatedMessage]
              break
            }
          }
          localStorage.setItem("chats",JSON.stringify(chats))
        }else{
          let chats=JSON.parse(localStorage.getItem("chats"))
          let isChat=false
          let updatedReceiver
          if(chats){
            for(let i=0;i<chats.length;i++){
              updatedReceiver=(chats[i].receiver===updatedMessage.sender)?updatedMessage.sender:updatedMessage.receiver
              if(chats[i].rideId===location.state.ride._id&&chats[i].receiver===updatedReceiver){
                chats[i].messages=[...chats[i].messages,updatedMessage]
                localStorage.setItem("chats",JSON.stringify(chats))
                isChat=true
                break
              }
            }
            if(!isChat){
              const alt=[]
              alt[0]={sender:user,receiver:updatedReceiver,rideId:location.state.ride._id,new:false,messages:[updatedMessage]}
              localStorage.setItem("chats",JSON.stringify(alt))
            }
            
          }else{
            const alt=[]
            alt[0]={sender:user,receiver:driverInfo._id,rideId:location.state.ride._id,new:false,messages:[updatedMessage],updatedAt:new Date()}
            localStorage.setItem("chats",JSON.stringify(alt))
          }
          
        }
        
      })
    }, [is]);

  //function for sending messages
  const sendMessage = (event)=>{

    //to prevent refresh when we press key
    event.preventDefault();

    if(message){
      socket.emit('sendMessage',{text:message});
      setMessage('')
    }
  }

  return (
    <div className='text-center'>
      <button  className='flex mt-3 w-[30%] h-[70px] mr-auto ml-auto hover:bg-[#EDEDED] rounded-2xl items-center'>
        <svg xmlns="http://www.w3.org/2000/svg" className='ml-5' fill='#6F8B90' viewBox="0 0 50 50" width="24px" height="24px"><path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 25 11 A 3 3 0 0 0 22 14 A 3 3 0 0 0 25 17 A 3 3 0 0 0 28 14 A 3 3 0 0 0 25 11 z M 21 21 L 21 23 L 22 23 L 23 23 L 23 36 L 22 36 L 21 36 L 21 38 L 22 38 L 23 38 L 27 38 L 28 38 L 29 38 L 29 36 L 28 36 L 27 36 L 27 21 L 26 21 L 22 21 L 21 21 z"/></svg>
        <div className='ml-5 '>
          <p className='text-black font-medium text-lg flex items-center '>{pickup.length>=2?pickup[pickup.length-2]:pickup[pickup.length-1]} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <polygon points="11.293 4.707 17.586 11 4 11 4 13 17.586 13 11.293 19.293 12.707 20.707 21.414 12 12.707 3.293 11.293 4.707"/></svg> {dropoff[dropoff.length-2]}
          </p>
          <label className='text-[#6F8B90] text-md font-medium'>{formattedDate} at {location.state.ride.time}</label>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className='ml-auto mr-5' width="24" height="24" viewBox="0 0 24 24">
          <polygon points="7.293 4.707 14.586 12 7.293 19.293 8.707 20.707 17.414 12 8.707 3.293 7.293 4.707"/>
        </svg>
      </button>
      <ScrollToBottom className="chat-message-list">
        <div className='w-[30%] ml-[35.5%] mr-auto'>
          <Messages messages={messages} name={location.state.name} avatar={avatar} />
        </div>
      </ScrollToBottom>
      <form>
        <textarea type="text" id="message" className="overflow-hidden  whitespace-normal mt-3 focus:outline-none focus:border-green-500  focus:border-2 outline-none border-[#EDEDED] font-medium text-lg ml-auto mr-auto  bg-[#EDEDED] rounded-2xl pl-5 w-[30%] h-[50px]"  placeholder="Your message"
          value={message}
          onChange={(event)=> setMessage(event.target.value)}
          onKeyPress={(event)=> event.key === 'Enter' ? sendMessage(event):null}
        />
      </form>
    </div>
  )
}

export default Chat;
