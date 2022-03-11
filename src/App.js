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

var started=false;
const LOCAL_STORAGE_KEY_ANSWERED_WORDS="wordlespeed.answers";
const LOCAL_STORAGE_KEY_ANSWERED_WORDS_MARKERS="wordlespeed.answers.markers";


const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en";

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

const fetchWord = (word) => {
  return fetch(`${API_URL}/${word}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((res) => res)
    .catch((err) => console.log("err:", err));
};

function App() {



  


  const [TimerStatus, setTimerStatus] = useState('off')
  //const [guessesMade, setGuessesMade] = useState({...newGame });

  const wordOfTheDay = "money";


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
  const [isShared, setIsShared] = useState(false);

  let letterIndex = useRef(0);
  let round = useRef(0);

  const win = () => {
    document.removeEventListener("keydown", handleKeyDown);
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
    localStorage.setItem(LOCAL_STORAGE_KEY_ANSWERED_WORDS,JSON.stringify(guesses))
    
    setMarkers(updatedMarkers);
    //localStorage.setItem(LOCAL_STORAGE_KEY_ANSWERED_WORDS_MARKERS,JSON.stringify(markers))
    console.log(markers);
    round.current = _round + 1;
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
    //console.log(pressedKey);
    const _letterIndex = letterIndex.current;
    const _round = round.current;

    //console.log(_letterIndex);

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
    console.log(pressedKey);
    console.log(letterIndex.current)
    console.log(guesses[round.current]);
    if (pressedKey === "enter" && /*!guesses[round.current].includes("")*/letterIndex.current===5) {
      console.log("enter Pressed");
      //change this to check against a valid word array
      submit();
     // const validWord = await fetchWord(guesses[round.current].join(""));

     // if (Array.isArray(validWord)) {
        
      //}
    } else if (pressedKey === "backspace") {
      erase();
    } else if (pressedKey !== "enter") {
      publish(pressedKey);
    }
  };

  const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  const handleClick = (key) => {
    const pressedKey = key.toLowerCase();

    enterGuess(pressedKey);
  };

  const copyMarkers = () => {
    //let shareText = `Wordle ${getDayOfYear()}`;   change this
    let shareText = `Wordle `
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

   // const stupid = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ANSWERED_WORDS));    
    const guessesMade = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ANSWERED_WORDS))
    //setGuessesMade(stupid);
    
    
    var guessesMadeArray;

   // console.log(stupid);

    console.log("Cookie");

    console.log(guessesMade);
    console.log("guesses");
    console.log(guesses);
    
    if(guessesMade!=null){
   
     // let end = false;
      guessesMadeArray = Object.values(guessesMade);
      guessesMadeArray.forEach((item) => {
          /*item.forEach((letter)=>{
            if(letter!==''){
            handleClick(letter);
            }else{
              end = true;
            }
          });
          if(end=== false){
            handleClick("enter");
          }*/

          var l0 = (item[0]);
          var l1 = (item[1]);
          var l2 = (item[2]);
          var l3 = (item[3]);
          var l4 = (item[4]);
          //console.log(typeof(l4));
          if(l0!=='' && l1!=='' && l2!=='' && l3!=='' && l4!==''){
            handleClick(l0);
            handleClick(l1);
            handleClick(l2);
            handleClick(l3);
            handleClick(l4);
            submit();
          }
          
          console.log("here");
        
        
        
       
        
        });
   
    }

    Modal.setAppElement("#share");

    document.addEventListener("keydown", handleKeyDown);
 
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
  

  return (
    <>
      <Main>
        <Header>WORDLE SPEED</Header>
        <Timer status={TimerStatus}/>
        <GameSection>
          <TileContainer>
          {Object.values(guesses).map((word, wordIndex) => (
              <TileRow key={wordIndex}>
              {word.map((letter, i) => (
                <Tile key={i} hint={markers[wordIndex][i]}>
                  {letter}
                </Tile>
              ))}
            </TileRow>
            ))}
          </TileContainer>
        </GameSection>
        <KeyboardSection>
          {keyboardRows.map((keys, i) => (
            <KeyboardRow key={i}>
              {i === 1 && <Flex item={0.5} />}
              {keys.map((key) => (
                <KeyboardButton
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
            <Heading>You win!</Heading>
            <Row>
              <h3>Share</h3>
              <ShareButton onClick={copyMarkers} disabled={isShared}>
                {isShared ? "Copied!" : "Share"}
              </ShareButton>
            </Row>
          </ShareModal>
        </Modal>
      </div>
    </>
  );
}

export default App;
