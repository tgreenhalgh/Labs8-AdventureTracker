import styled from 'styled-components';
import { device } from '../../../lib/device';
const InstructionsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  position: relative;
  margin-top: 3rem;

  /* margin-top: ${props => props.theme.navbarHeight}; */
  /* margin-left: ${props => props.theme.sidebarWidth}; */
  height: 100vh;
  /* @media ${device.tablet} {
    margin: 0 0 0 auto;
    background: pink;
  } */
  flex-flow: column;
  width: 100%;
  max-width: 35rem;
  /* background: ${props => props.theme.opacityblack}; */
  background: ${props => props.theme.opacityblack};
  position: fixed;
  top: 0;
  bottom: 0;
  text-transform: capitalize;
  padding: 2rem 3rem;
  color: ${props => props.theme.white};
  & > * {
    margin-bottom: 2rem;
  }
  margin: 9rem 0 0 0;
`;

export { InstructionsContainer };
