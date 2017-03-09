import styled from 'styled-components';

export const Select = styled.select`
  display: block;
  margin-top: 5px;
  font-size: 12px;
  background: white;
  border: 1px solid #CECECE;
  max-width: 90%;

  &:focus {
    outline: none;
  }
`
export const Selector = styled.div`
  height: auto;
  ${''/* background-color: orange; */}
`
export const CalculateBtn = styled.button`
  background-color: #FFFFCC;
  border: 1px solid #FFA500;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #FFFF66;
  }

  &:focus {
    outline: none;
  }
`
