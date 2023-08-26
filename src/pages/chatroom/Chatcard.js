import React from "react";
import { useNavigate } from "react-router-dom";
import Avatars from '../../assets/images/avatars.png'
const Chatcard=({ride,name,avatar,isNew,updatedTime,setNew,rideId,receiver,sender})=>{
    console.log(receiver)
    const navigate=useNavigate()
    const dateString = updatedTime.split("T")[0];
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-US", { weekday: 'short', day: 'numeric', month: 'long' });
    const pickup=ride.from.split(",")
    const dropoff=ride.to.split(",")
    const handleClick=()=>{
        setNew()
        navigate('/chatroom',{state:{ride:ride,rideId:rideId,sender:sender,receiver:receiver,name:name,avatar:avatar}})
    }
    return(
        <button onClick={handleClick} className='text-center flex mt-0 w-[500px] lg:w-[500px] xl:w-[600px] h-[85px] mr-auto ml-auto hover:bg-[#EDEDED] rounded-2xl items-center'>
            <div className={isNew?'ml-5 text-left text-black':'ml-5 text-left text-[#6F8B90]'}>
                <p className=' font-medium text-lg flex items-center '>{name}</p>
                <p className=' font-medium text-md flex items-center '>{pickup.length>=2?pickup[pickup.length-2]:pickup[pickup.length-1]} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                    <polygon points="11.293 4.707 17.586 11 4 11 4 13 17.586 13 11.293 19.293 12.707 20.707 21.414 12 12.707 3.293 11.293 4.707"/></svg> {dropoff[dropoff.length-2]}
                </p>
                <label className=' text-sm font-medium text-left'>{formattedDate}</label>
            </div>
            
            <img src={avatar||Avatars} className=" ml-56 lg:ml-56 xl:ml-80 mr-auto w-12 rounded-full"></img>
            {isNew&&<span class="pt-1 items-center rounded-md bg-red-600 -ml-10 lg:-ml-10 xl:-ml-10 -mt-10 w-10 h-6 text-xs font-medium text-white">New</span>}
            <svg xmlns="http://www.w3.org/2000/svg" className='ml-auto mr-5' width="24" height="24" viewBox="0 0 24 24">
            <polygon points="7.293 4.707 14.586 12 7.293 19.293 8.707 20.707 17.414 12 8.707 3.293 7.293 4.707"/>
            </svg>
        </button>
    )
}

export default Chatcard