import React ,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/config";
import Chatcard from '../chatroom/Chatcard'
const Chatcards=()=>{
    const chats=JSON.parse(localStorage.getItem('chats'))
    const navigate=useNavigate()
    const [rides,setRides]=useState([])
    const [names,setNames]=useState([])
    const [avatars,setAvatars]=useState([])
    const [isLoaded,setIsLoaded]=useState(false)
    const [isNew,setIsNew]=useState([])
    let count=0
    
    useEffect(() => {
        const fetchData = async () => {
            try {
            const ridePromises = chats.map((chat) =>
                fetch(`${BASE_URL}/rides/getride?user=${chat.rideId}`).then((res) =>
                res.json()
                )
            );
            const namePromises = chats.map((chat) =>
                fetch(`${BASE_URL}/users/getuser?user=${chat.receiver}`).then((res) =>
                res.json()
                )
            );

            const ridesData = await Promise.all(ridePromises);
            const namesData = await Promise.all(namePromises);
            setRides((prevRides) => [...prevRides, ...ridesData.map((data) => data.ride)]);
            setNames((prevNames) => [...prevNames, ...namesData.map((data) => data.name)]);
            setIsLoaded(true);
            } catch (err) {
            console.log(err);
            }
        };
        fetchData();
        }, []);
    useEffect(()=>{
        const fetchAvatars = async () => {
            for (const chat of chats) {
                const res=await fetch(`${BASE_URL}/users/getavatar?id=${chat.receiver}`);
                setIsNew([...isNew,chat.new])
                if(!res.ok){
                    setAvatars((prev)=>[...prev," "]);
                }else{
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    setAvatars((prev)=>[...prev,url]);
                }
            }
        };
        fetchAvatars();
    },[])
    const setNew=(chat,count)=>{
        setIsNew((prev)=>prev.map((value,index)=>(index===count&&false)))
        for(const one of chats){
            if(chat===one){
                chat.new=false
                localStorage.setItem("chats",JSON.stringify(chats))
            }
        }
    }
    return(
        <div>
            {isLoaded&&chats ? 
                <div className="text-center">
                    <div className='text-3xl font-bold mt-10 text-green-400 ml-auto mr-auto mb-5'>Inbox</div>
                    {chats.map((chat,index)=>{
                        return <Chatcard key={index} ride={rides[count]} rideId={chat.rideId} receiver={chat.receiver} sender={chat.sender} avatar={avatars[count]} setNew={()=>setNew(chat,count)} isNew={isNew[count]} updatedTime={chat.updatedAt} name={names[count++]} />
                    })}
                </div>
                :chats&&!isLoaded?<div className="text-center"><h1 className='text-3xl font-bold mt-52 text-green-400 w-[60%] ml-auto mr-auto'>...loading</h1></div>:
                <div className='text-center'>
                    <h1 className='text-5xl font-bold mt-52 text-green-400 w-[60%] ml-auto mr-auto'>There are no messages</h1>
                    <button type='submit' onClick={()=>navigate('/home')} className='mt-24 bg-green-400 text-white font-bold rounded-full h-12 w-40 hover:bg-green-500'>Ok</button>
                </div>
            }
        </div>
    )
}

export default Chatcards