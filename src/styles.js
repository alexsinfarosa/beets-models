import styled from "styled-components";

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
  width: 870px;
  max-height: 650px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 20px;
  ${''/* background-color: green; */}
`;

export const Main = styled.div`
  display: flex;
  ${''/* align-items: stretch; */}
  width: 100%;
`

export const LeftContainer = styled.div`
  border: 1px solid #808080;
  ${''/* height: 280px; */}
  flex-basis: 220px;
  margin-right: 10px;
  padding: 10px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 5px;
`

export const RightContainer = styled.div`
  border: 1px solid #E0CFC2;
  background-color: #F4F0EC;
  ${''/* height: 608px; */}
  flex: 1;
  padding: 10px;
  border-radius: 5px;
`
