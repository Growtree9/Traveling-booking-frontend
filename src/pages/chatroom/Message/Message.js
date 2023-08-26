import React, { useEffect ,useRef,useLayoutEffect} from 'react';
import ReactEmoji from 'react-emoji';
import { AuthContext } from '../../../context/AuthContext';
import { useContext } from 'react';
import './Message.css';
import Avatars from '../../../assets/images/avatars.png'

const Message = ({message:{receiver,text,sender,date},name,avatar,isNewDate,isNewUser,isNewTime,previousUser})=>{
  const {user}=useContext(AuthContext)
  let IsoString=date
  if(date instanceof Date){
    IsoString=date.toISOString()
  }
  const dateString = IsoString.split("T")[0];
  const newDate = new Date(dateString);
  const newFormattedDate = newDate.toLocaleDateString("en-US", { weekday: 'short', day: 'numeric', month: 'long' });
  const newTime=IsoString.split("T")[1].slice(0,5)
  return (
    <div>
      {isNewDate&&
        <div className='flex w-full mr-auto ml-auto mt-2 text-[#6F8B90] items-center'>
          <hr className='w-[40%] border border-black  mr-2'></hr>
          <label className=' font-medium text-sm mr-2'>{newFormattedDate}</label>
          <hr className='w-[40%] border border-black'></hr>
        </div>
      }
      {(user===sender) ? 
        <div>
          <div className="messageContainer justifyEnd mr-5">
            <div className="messageBox backgroundBlue rounded-tl-xl rounded-bl-xl rounded-br-xl">
              <p className="messageText colorWhite font-medium text-right">{ReactEmoji.emojify(text)}</p>
            </div>
          </div>
          <p className='text-[#6F8B90] font-bold text-xs text-right mr-10'>{newTime}</p>
        </div>
       : (user===receiver)?
        <div>
          {isNewUser&&
            <div className='flex items-center'>
              <img src={avatar||Avatars} className='w-12 rounded-full'/>
              <p className='text-black font-medium text-xl text-left ml-5'>{name}</p>
            </div>
          }
          <div className="messageContainer justifyStart ml-5">
            <div className="messageBox backgroundLight rounded-tr-xl rounded-bl-xl rounded-br-xl">
              <p className="messageText colorDark font-medium text-left">{ReactEmoji.emojify(text)}</p>
            </div>
          </div>
          <p className='text-[#6F8B90] font-bold text-xs text-left ml-10'>{newTime}</p>
        </div>
      :null}
      </div>
  )
}
export default Message;
