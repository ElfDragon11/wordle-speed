import {
  Main,
  Header,
  GameSection,
  TileContainer,
  TileRow,
  Tile,
  KeyboardSection,
  KeyboardRow,
  KeyboardButton,
  Flex,
  ShareModal,
  Heading,
  Row,
  ShareButton,
} from "./styled";
import Timer from './Timer';
import { BackspaceIcon } from "./icons";
import "./App.css";
import { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { listWords, validWords } from './listWords';

var started=false;
var winStatus = "Win";
const LOCAL_STORAGE_KEY_ANSWERED_WORDS="wordlespeed.answers";
const LOCAL_STORAGE_KEY_CBTOGGLE="wordlespeed.cbtoggle";

var CBButtonValue = "Enable ColorBlind";


const dayLength = 86400000;
const startTime = 1646895600000-(dayLength*5);


const keyboardRows = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["enter", "z", "x", "c", "v", "b", "n", "m", "backspace"],
];

const allKeys = keyboardRows.flat();

const wordLength = 5;

const newGame = {
  0: Array.from({ length: wordLength }).fill(""),
  1: Array.from({ length: wordLength }).fill(""),
  2: Array.from({ length: wordLength }).fill(""),
  3: Array.from({ length: wordLength }).fill(""),
  4: Array.from({ length: wordLength }).fill(""),
  5: Array.from({ length: wordLength }).fill(""),
};


function App() {

  let d = new Date();
  let answerIndex = Math.floor((d.getTime() - startTime)/dayLength)

  const [TimerStatus, setTimerStatus] = useState('off')

 
  const [colorBlindMode, setcolorBlindMode]  = useState(false);

  var wordOfTheDay = "money";


  const [guesses, setGuesses] = useState({ ...newGame });
  const [markers, setMarkers] = useState({
    0: Array.from({ length: wordLength }).fill(""),
    1: Array.from({ length: wordLength }).fill(""),
    2: Array.from({ length: wordLength }).fill(""),
    3: Array.from({ length: wordLength }).fill(""),
    4: Array.from({ length: wordLength }).fill(""),
    5: Array.from({ length: wordLength }).fill(""),
  });
  const [isModalVisible, setModalVisible] = useState(false);
  const [isRulesModalVisible, setRulesModalVisible] = useState(false);
  const [isLeaderBoardModalVisible, setLeaderBoardModalVisible] = useState(false);
  const [isShared, setIsShared] = useState(false);

  let letterIndex = useRef(0);
  let round = useRef(0);

  let keyColors = useRef({key:[], color: []});

/*
  const timerStop = (timerValue) => {
    setTimerTime(timerValue);
  }
*/
  const colorBlindToggle = () =>{
    setcolorBlindMode(!colorBlindMode);
    console.log(colorBlindMode);
    document.getElementById("CBtoggle").blur();
    
    if(colorBlindMode){
      CBButtonValue="Enable ColorBlind";
      
    }else{
      
      CBButtonValue="Disable ColorBlind";
      
    }
    
    localStorage.setItem(LOCAL_STORAGE_KEY_CBTOGGLE, JSON.stringify(colorBlindMode));
  }

  const openRules =()=>{
    setRulesModalVisible(true);
  }

  const openLeaderBoard =()=>{
    setLeaderBoardModalVisible(true);
  }

  const win = () => {
    document.removeEventListener("keydown", handleKeyDown);
    setTimerStatus("off")
    setModalVisible(true);
  };

  const lose = () => {
    document.removeEventListener("keydown", handleKeyDown);
    winStatus="Lose"
    setTimerStatus("off")
    setModalVisible(true);
  };

  const submit = () => {
    const _round = round.current;

    const updatedMarkers = {
      ...markers,
    };

    const tempWord = wordOfTheDay.split("");

    const leftoverIndices = [];

    // Prioritize the letters in the correct spot
    tempWord.forEach((letter, index) => {
      const guessedLetter = guesses[_round][index];

      if (guessedLetter === letter) {
        updatedMarkers[_round][index] = "green";
        tempWord[index] = "";
      } else {
        // We will use this to mark other letters for hints
        leftoverIndices.push(index);
      }
    });

    if (updatedMarkers[_round].every((guess) => guess === "green")) {
      setMarkers(updatedMarkers);
      localStorage.setItem(LOCAL_STORAGE_KEY_ANSWERED_WORDS,JSON.stringify({guessObj: guesses, timeSet: d.getMonth()+"."+d.getDate()}))
      win();
      return;
    }

    // Then find the letters in wrong spots
    if (leftoverIndices.length) {
      leftoverIndices.forEach((index) => {
        const guessedLetter = guesses[_round][index];
        const correctPositionOfLetter = tempWord.indexOf(guessedLetter);
        
        if (
          tempWord.includes(guessedLetter) &&
          correctPositionOfLetter !== index
        ) {
          // Mark yellow when letter is in the word of the day but in the wrong spot
          updatedMarkers[_round][index] = "yellow";
          tempWord[correctPositionOfLetter] = "";
        
        } else {
          // This means the letter is not in the word of the day.
          updatedMarkers[_round][index] = "grey";
        }
      });
    }
    localStorage.setItem(LOCAL_STORAGE_KEY_ANSWERED_WORDS,JSON.stringify({guessObj: guesses, timeSet: d.getMonth()+"."+d.getDate()}))
    
    setMarkers(updatedMarkers);
    round.current = _round + 1;
    if(round.current===6){
      lose();
    }
    letterIndex.current = 0;
  };

  const erase = () => {
    const _letterIndex = letterIndex.current;
    const _round = round.current;

    if (_letterIndex !== 0) {
      setGuesses((prev) => {
        const newGuesses = { ...prev };
        newGuesses[_round][_letterIndex - 1] = "";
        
        return newGuesses;
      });

      letterIndex.current = _letterIndex - 1;
    }
  };

  const publish = (pressedKey) => {
    if(!started){
      started=true;
      setTimerStatus("running")
    }
    
    const _letterIndex = letterIndex.current;
    const _round = round.current;


    if (_letterIndex < wordLength) {
      setGuesses((prev) => {
        const newGuesses = { ...prev };
        newGuesses[_round][_letterIndex] = pressedKey.toLowerCase();
        return newGuesses;
      });

      letterIndex.current = _letterIndex + 1;
    }
  };

  const enterGuess = async (pressedKey) => {

    if (pressedKey === "enter" && letterIndex.current===5) {
     
      if(validWords.includes(guesses[round.current].join(""))){
        submit();
      }else if(listWords.includes(guesses[round.current].join(""))){
        submit();
        
      }
 
    } else if (pressedKey === "backspace") {
      erase();
    } else if (pressedKey !== "enter") {
      publish(pressedKey);
    }
  };


  const handleClick = (key) => {
    const pressedKey = key.toLowerCase();

    enterGuess(pressedKey);
  };

  const copyMarkers = () => {
    //let shareText = `Wordle ${getDayOfYear()}`;   change this
    var timeObj = JSON.parse(localStorage.getItem("wordlespeed.times")).StoredObj
    console.log(timeObj);
    var time="";
    if(timeObj.TimerHours>0){
      if(timeObj.TimerHours<10){
        time += "0"+timeObj.TimerHours+":";
      }else{
        time += timeObj.TimerHours+":";
      }
    }
    if(timeObj.TimerMinutes<10){
      time += "0"+timeObj.TimerMinutes+":";
    }else{
      time += timeObj.TimerMinutes+":";
    }
    if(timeObj.TimerSeconds<10){
      time += "0"+timeObj.TimerSeconds+".";
    }else{
      time += timeObj.TimerSeconds+".";
    }
    if(timeObj.TimerMilliseconds<10){
      time += "0"+timeObj.TimerMilliseconds;
    }else{
      time += timeObj.TimerMilliseconds;
    }

    
    
    let shareText = `Speedle ${answerIndex} \nTime: ${time}\n`
    let shareGuesses = "";

    const amountOfGuesses = Object.entries(markers)
      .filter(([_, guesses]) => !guesses.includes(""))
      .map((round) => {
        const [_, guesses] = round;

        guesses.forEach((guess) => {
          if (guess === "green") {
            shareGuesses += "🟩";
          } else if (guess === "yellow") {
            shareGuesses += "🟨";
          } else {
            shareGuesses += "⬛️";
          }
        });

        shareGuesses += "\n";

        return "";
      });

    shareText += ` ${amountOfGuesses.length}/6\n${shareGuesses}`;

    navigator.clipboard.writeText(shareText);
    setIsShared(true);
  };

  const handleKeyDown = (e) => {
    const pressedKey = e.key.toLowerCase();

    if (allKeys.includes(pressedKey)) {
      enterGuess(pressedKey);
    }
  };


  useEffect(() => {

    
    console.log(d.getMonth()+"."+d.getDate());

    
    const CBcookie = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_CBTOGGLE));   
    if(CBcookie!== null){
      if(CBcookie===false){
        colorBlindToggle();
      }
    }

   
    wordOfTheDay = listWords[answerIndex];
    const storedAnswers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ANSWERED_WORDS));
    
    if(storedAnswers!=null){

      if(storedAnswers.timeSet!== (d.getMonth()+"."+d.getDate())){
        localStorage.removeItem(LOCAL_STORAGE_KEY_ANSWERED_WORDS);

        Modal.setAppElement("#share");

        document.addEventListener("keydown", handleKeyDown);
     
        return () => document.removeEventListener("keydown", handleKeyDown);
      }

      const guessesMade = storedAnswers.guessObj;
      var guessesMadeArray = Object.values(guessesMade);
      guessesMadeArray.forEach((Word) => {

          var l0 = (Word[0]);
          var l1 = (Word[1]);
          var l2 = (Word[2]);
          var l3 = (Word[3]);
          var l4 = (Word[4]);

          if(l0!=='' && l1!=='' && l2!=='' && l3!=='' && l4!==''){
            
            setTimeout(function() {
              handleClick(l0);
            }, 1);
            setTimeout(function() {
              handleClick(l1);
            }, 1);
            setTimeout(function() {
              handleClick(l2);
            }, 1);
            setTimeout(function() {
              handleClick(l3);
            }, 1);
            setTimeout(function() {
              handleClick(l4);
            }, 1);
            setTimeout(function() {
              handleClick("enter");
            }, 1);
        
          /*
            handleClick(l0);
            handleClick(l1);
            handleClick(l2);
            handleClick(l3);
            handleClick(l4);
            handleClick("enter");
          */
          }
        });
   
    }
    


    Modal.setAppElement("#share");

    document.addEventListener("keydown", handleKeyDown);
 
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
  

  
  function KeyboardKeyColor(key) {
    var i = round.current;
    
      if(Object.values(guesses)[i].indexOf(key)>=0){
        let keyMarkerIndex = Object.values(guesses)[i].indexOf(key);
        if(markers[i][keyMarkerIndex]==="green"||markers[i][keyMarkerIndex]==="yellow"||markers[i][keyMarkerIndex]==="grey"){
          if(keyColors.current.key.includes(key)){
            if(keyColors.current.color[keyColors.current.key.indexOf(key)] !=="green"){
              keyColors.current.color[keyColors.current.key.indexOf(key)] = markers[i][keyMarkerIndex];
            }
          }else{
            keyColors.current.color = [...keyColors.current.color, markers[i][keyMarkerIndex]];
            keyColors.current.key = [...keyColors.current.key, key];  
          }
        }
      }   
      if(keyColors.current.key.includes(key)){
        return keyColors.current.color[keyColors.current.key.indexOf(key)];    
      }
  }

  return (
    <>
      <Main rerender={colorBlindMode}>
        
        <Header>WORDLE SPEED</Header>
        
        <div id="topBar">
          <article id="RulesLinkContainter" className="topBarItem"><p id="LinkContainter" onClick={()=> openRules()}>Rules</p></article>
          <article id="LeaderboardLinkContainter" className="topBarItem"><p onClick={()=> openLeaderBoard()}>Leaderboard</p></article>
          <article id="CBContainer" className="topBarItem"><input id="CBtoggle"type="button" value={CBButtonValue} onClick={()=>colorBlindToggle()} /></article>
         
          
          
        </div>
        <Timer status={TimerStatus}  />
        <GameSection>
          <TileContainer>
          {Object.values(guesses).map((word, wordIndex) => (
              <TileRow key={wordIndex}>
              {word.map((letter, i) => (
                <Tile key={i} hint={markers[wordIndex][i]} CB={colorBlindMode}>
                  {letter}
                </Tile>
              ))}
            </TileRow>
            ))}
          </TileContainer>
        </GameSection>
        <KeyboardSection >
          {keyboardRows.map((keys, i) => (
            <KeyboardRow key={i}>
              {i === 1 && <Flex item={0.5} />}
              {keys.map((key) => (
                <KeyboardButton
                  hint={KeyboardKeyColor(key)} 
                  CB={colorBlindMode}
                  key={key}
                  onClick={() => handleClick(key)}
                  flex={["enter", "backspace"].includes(key) ? 1.5 : 1}
                >
                  {key === "backspace" ? <BackspaceIcon /> : key}
                </KeyboardButton>
              ))}
              {i === 1 && <Flex item={0.5} />}
            </KeyboardRow>
          ))}
        </KeyboardSection>
      </Main>
      <div id="share">
        <Modal
          isOpen={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
            },
          }}
          contentLabel="Share"
        >
          <ShareModal>
            <Heading>You {winStatus}!</Heading>
            <Row>
              <h3>Share Speedle</h3>
              <ShareButton onClick={copyMarkers} disabled={isShared}>
                {isShared ? "Copied!" : "Share"}
              </ShareButton>
            </Row>
          </ShareModal>
        </Modal>
      </div>

      <div id="rules">
        <Modal
          isOpen={isRulesModalVisible}
          onRequestClose={() => setRulesModalVisible(false)}
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
            },
          }}
          contentLabel="Share"
        >
          <ShareModal>
            <Heading>Rules</Heading>
             <Row>
               <p>Same rules as Wordle, but get the fastest time <br /> you can. Hope you know what your doing.</p>
             </Row>
          </ShareModal>
        </Modal>
      </div>

      <div id="leaderboard">
        <Modal
          isOpen={isLeaderBoardModalVisible}
          onRequestClose={() => setLeaderBoardModalVisible(false)}
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
            },
          }}
          contentLabel="Share"
        >
          <ShareModal>
            <Heading>Leaderboard</Heading>
            <Row>
             <p>In Progress</p>
            </Row>
          </ShareModal>
        </Modal>
      </div>
    </>
  );
}

export default App;
