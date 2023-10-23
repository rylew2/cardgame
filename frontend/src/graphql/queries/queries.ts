import { gql } from '@apollo/client';

export const GET_GENERAL_QUERY = gql`
  query mygeneralquery {
    cardsLeftInDeck
    acesLeftInDeck
    gameStatus
  }
`;
