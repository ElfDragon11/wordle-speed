import './LeaderBoardRow.css';
import { useState} from 'react';

export default function LeaderBoardRow({RecordRow, Ranking}) {
   const [rank, setRank] = useState(Ranking);
   const [Row, setRow] = useState(RecordRow);
   var time= Row.Time+"";


   String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this,10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    var milliseconds = parseInt(((this-sec_num)*100),10);


    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    if (milliseconds < 10) {milliseconds = "0"+milliseconds;}
    if(hours>0){
        return hours+':'+minutes+':'+seconds+"."+milliseconds;
    }else{
        return minutes+':'+seconds+"."+milliseconds;
    }
    
    }
     
    return (

        <div id="Row">
            <p id="Rank">{rank+1}</p>
            <p id="Name">{Row.Name}</p>
            <p id="Time">{ time.toHHMMSS() }</p>

        </div>

    );
}


