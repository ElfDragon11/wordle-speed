import styled from "styled-components";

export const Main = styled.main`
  font-family: "Clear Sans", "Helvetica Neue", Arial, sans-serif;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  height: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

export const Header = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 100%;

  border-bottom: 1px solid #3a3a3c;

  font-weight: 700;
  font-size: 3.6rem;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
`;

export const GameSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  margin-bottom:10px;
`;
export const TileContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  grid-gap: 5px;

  height: 420px;
  width: 350px;
`;
export const TileRow = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 5px;
`;
export const Tile = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;

  border: 2px solid #828282;
  font-size: 3.2rem;
  font-weight: bold;
  line-height: 3.2rem;
  text-transform: uppercase;

  ${({ hint , CB}) => {
    if(CB){
      if (hint === "green") {
        return `background-color: #e0a45f;`;
      }
      if (hint === "yellow") {
        return `background-color: #37ace2;`;
      }
      if (hint === "grey") {
        return `background-color: #828282;`;
      }
    }else{
      if (hint === "green") {
        return `background-color: #6aaa64;`;
      }
      if (hint === "yellow") {
        return `background-color: #e6c94c;`;
      }
      if (hint === "grey") {
        return `background-color: #828282;`;
      }
    }

  }}
  ${({ hint , CB}) => {
    if(CB){
      if (hint === "green") {
        return `border: 2px solid #e0a45f;`;
      }
      if (hint === "yellow") {
        return `border: 2px solid #37ace2;`;
      }
      if (hint === "grey") {
        return `border: 2px solid #828282;`;
      }
  }else{
    if (hint === "green") {
      return `border: 2px solid #6aaa64;`;
    }
    if (hint === "yellow") {
      return `border: 2px solid #e6c94c;`;
    }
    if (hint === "grey") {
      return `border: 2px solid #828282;`;
    }
  }
  }}

  user-select: none;
`;

export const KeyboardSection = styled.section`
  height: 200px;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const KeyboardRow = styled.div`
  width: 100%;
  margin: 0 auto 8px;

  display: flex;
  align-items: center;
  justify-content: space-around;
`;

export const KeyboardButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0 6px 0 0;
  height: 58px;
  ${({ item }) => (item ? `flex: ${item};` : `flex: 1;`)}

  border: 0;
  border-radius: 4px;
  background-color: #bebebe;
  font-weight: bold;
  text-transform: uppercase;
  color: black;

  cursor: pointer;
  user-select: none;

  &:last-of-type {
    margin: 0;
  }

  ${({hint , CB}) => {
    if(CB){
      if (hint === "green") {
        return `background-color: #e0a45f; color: black;`;
      }
      if (hint === "yellow") {
        return `background-color: #37ace2; color: black;`;
      }
      if (hint === "grey") {
         return `background-color: #828282; color: white;`;
      }
    }else{
      if (hint === "green") {
        return `background-color: #6aaa64; color: black;`;
      }
      if (hint === "yellow") {
        return `background-color: #e6c94c; color: black;`;

      }
      if (hint === "grey") {
        return `background-color: #828282; color: white;`;

      }
    }

  }}

`;

export const Flex = styled.div`
  ${({ item }) => `flex: ${item};`}
`;

export const ShareModal = styled.div`
  font-family: "Clear Sans", "Helvetica Neue", Arial, sans-serif;
`;

export const ShareButton = styled.button`
  font-size: 18px;
  padding: 8px 16px;
  border-radius: 4px;
  border: 2px solid #3a3a3c;
  margin-left: 5px;

  transition: background-color 0.2s ease-in;

  &:hover {
    background-color: #818384;
  }
`;

export const Heading = styled.h2`
  border-bottom: 1px solid #3a3a3c;
  padding-bottom: 8px;

  text-align: center;
  font-weight: 700;
  font-size: 3rem;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 20px;
  margin: 16px auto;
`;


export const LeaderBoardModal = styled.div`
  font-family: "Clear Sans", "Helvetica Neue", Arial, sans-serif;
  height:100px;
`;
export const LeaderBoardRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  font-size: 20px;
  margin: 16px auto;
`;
