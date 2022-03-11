import './Timer.css';
import { useEffect} from 'react';

var $ = function(id){
    return document.getElementById(id);
};
var hours=0;
var minutes=0;
var seconds=0;
var milliseconds=0;

var timer;
const LOCAL_STORAGE_KEY_TIMES="WordleSpeed.times";
export default function Timer({status}) {
    useEffect(() => {
       if(status==="running"){
        startClock();
       }else if(status==="off"){
        stopClock();
       }
      }, [status]);
      useEffect(() => {
        if(hours===0 && minutes===0 && seconds===0 && milliseconds===0){
            const storedTimes= JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TIMES))
            
            if(storedTimes){
                hours = storedTimes.TimerHours;
                minutes = storedTimes.TimerMinutes;
                seconds = storedTimes.TimerSeconds;
                milliseconds = storedTimes.TimerMilliseconds;
                if(minutes<10){
                   $("minutes").innerHTML="0"+minutes;
                }else{
                    $("minutes").innerHTML=minutes;
                } 
                if(seconds<10){
                    $("seconds").innerHTML="0"+seconds;
                }else{
                    $("seconds").innerHTML=seconds;
                }
                if(milliseconds<10){
                    $("milliseconds").innerHTML="0"+milliseconds;
                }else{
                    $("milliseconds").innerHTML=milliseconds;
                }
            }
        }
       }, []);
     
    return (

        <div id="Timer">
           
            <p id="minutes">00</p>
            <p id="colon">:</p>
            <p id="seconds">00</p>
            <p id="period">.</p>
            <p id="milliseconds">00</p>
            
        </div>

    );
}








var updateTime = function() {
    if(milliseconds===99){
        if(seconds===59){
            if(minutes===59){
                if(hours===23){
                    stopClock();
                    hours=0;
                }else{
                    hours++;
                }
                minutes=0;
            }else{
                minutes++;
               
            }
            if(minutes<10){
                $("minutes").innerHTML="0"+minutes;
            }else{
                $("minutes").innerHTML=minutes;
            }
            seconds=0;
        }else{
            seconds++;
        }
        if(seconds<10){
            $("seconds").innerHTML="0"+seconds;
        }else{
            $("seconds").innerHTML=seconds;
        }
        milliseconds=0;
    }else{
        milliseconds++;
    }
    if(milliseconds<10){
        $("milliseconds").innerHTML="0"+milliseconds;
    }else{
        $("milliseconds").innerHTML=milliseconds;
    }

    
    localStorage.setItem(LOCAL_STORAGE_KEY_TIMES,JSON.stringify({TimerHours:hours, TimerMinutes:minutes, TimerSeconds: seconds, TimerMilliseconds:milliseconds}))
};


var startClock = function(){


    timer = setInterval(updateTime, 10);
   
};

var stopClock = function(){
    clearInterval(timer);
    
}

