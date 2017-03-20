import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const Page = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  ${/* background-color: lightgreen; */ ""}
`;

export const MyApp = styled.div`
  border: 1px solid #eee;
  border-radius: 5px;
  width: 915px;
  min-height: 715px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: stretch;
  padding: 20px;
  ${/* background-color: green; */ ""}
`;

export const Main = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex: 1;
  ${/* background-color: orange; */ ""}
`;

export const LeftContainer = styled.div`
  border: 1px solid #808080;
  height: 280px;
  flex-basis: 220px;
  margin-right: 10px;
  padding: 10px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 5px;
`;

export const RightContainer = styled.div`
  border: 1px solid #E0CFC2;
  background-color: #F4F0EC;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 10px;
  padding-top: 0;
  border-radius: 5px;
  ${/* overflow: auto; */ ""}
  ${/* height: 100%; */ ""}
`;

export const Ul = styled.ul`
  list-style: none;
  margin: 0;
  margin-top: 5px;
  margin-bottom: 10px;
  padding: 0;
  display: flex;
  align-items: stretch;
  border: 1px solid #d49768;
  border-radius: 5px;
  font-family: Helvetica,Arial,sans-serif;
  background: linear-gradient(#cb842e, #d49768 );
`;

export const NavLinkStyled = styled(NavLink)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  margin-left: 5px;
  padding: 10px;
  background-color: #ede4d4;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  color: #544C45;

  &:visited {
    color: #544C45;
    background-color: #F4F0EC;
    margin-bottom: -1px;
  }
  &:focus {
    color: #b85700;
    background-color: #F4F0EC;
    margin-bottom: -1px;
  }
  &:hover {
    background-color: #f4f0ec;
    color: #b85700;
  }
  &:active {
    background-color: #f4f0ec;
    color: #b85700;
  }
`;

export const CalculateBtn = styled.button`
  background-color: #FFFFCC;
  border: 1px solid #FFA500;
  font-size: 14px;
  cursor: pointer;

  cursor: ${props => props.inactive && "not-allowed"};
  pointer-events: ${props => props.inactive && "none"};
  opacity: ${props => props.inactive && "0.5"};


  &:hover {
    background-color: #FFFF66;
  }

  &:focus {
    outline: none;
  }
`;
