import './LeaderBoardRow.css';
import { useState, useEffect} from 'react';

export default function LeaderBoardRow({RecordRow, Ranking}) {
   const [rank, setRank] = useState(Ranking);

   const [Row, setRow] = useState(RecordRow);
    useEffect(() => {
    
        
    }, []);
     
    return (

        <div id="Row">
            <p id="Rank">{rank}</p>
            <p id="Name">{Row.Name}</p>
            <p id="Time">{Row.Time}</p>

        </div>

    );
}


