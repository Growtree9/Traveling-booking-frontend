import React ,{useEffect,useState} from 'react';

import Message from '../Message/Message';

import './Messages.css';

const Messages = ({ messages, avatar,name}) => {
    let isNewDate=[]
    let isNewUser=[]
    let isNewTime=[]
    let previousUser=[]
    isNewDate[0]=true
    isNewUser[0]=true
    for(let j=1;j<messages.length;j++){
        let IsoString1=messages[j-1].date
        if(IsoString1 instanceof Date){
            IsoString1=messages[j-1].date.toISOString()
        }
        const dateString1 = IsoString1.split("T")[0];
        const newDate1 = new Date(dateString1);
        const newFormattedDate1 = newDate1.toLocaleDateString("en-US", { weekday: 'short', day: 'numeric', month: 'long' });
        const newTime1=IsoString1.split("T")[1].slice(0,5)
        let IsoString2=messages[j].date
        if(IsoString2 instanceof Date){
            IsoString2=messages[j].date.toISOString()
        }
        const dateString2 = IsoString2.split("T")[0];
        const newDate2 = new Date(dateString2);
        const newFormattedDate2 = newDate2.toLocaleDateString("en-US", { weekday: 'short', day: 'numeric', month: 'long' });
        const newTime2=IsoString2.split("T")[1].slice(0,5)
        
        if(newFormattedDate1===newFormattedDate2){
            isNewDate[j]=false
        }else{
            isNewDate[j]=true
        }
        if(newTime1===newTime2){
            isNewTime[j-1]=false
        }else{
            isNewTime[j-1]=true
        }
        console.log(isNewTime[j-1])
        if(messages[j-1].receiver===messages[j].receiver){
            isNewUser[j]=false
        }else{
            isNewUser[j]=true
        }
        if(messages[j-1].receiver===messages[j].receiver){
            previousUser[j-1]=false
        }else{
            previousUser[j-1]=true
        }
    }
    isNewTime[messages.length-1]=true
    previousUser[messages.length-1]=true
    let count=0
    return(
        <div className="messages">
            {messages.map((message, i) => <Message key={i} message={message} name={name} avatar={avatar}  isNewTime={isNewTime[count]} previousUser={previousUser[count]} isNewUser={isNewUser[count]} isNewDate={isNewDate[count++]} />)}
        </div>
    )
    
    
}

export default Messages;