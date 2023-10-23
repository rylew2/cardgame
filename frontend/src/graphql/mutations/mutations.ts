import { gql } from '@apollo/client';

export const DEAL_CARDS_MUTATION = gql`
  mutation mycarddeal($count: Int!) {
    dealCards(count: $count) {
      success
      message
      cardsLeftInDeck
      acesLeftInDeck
      gameStatus
      dealtCards {
        id
        suit
        rank
        status
      }
      deck {
        id
        suit
        rank
        status
      }
    }
  }
`;

export const RESET_GAME_MUTATION = gql`
  mutation myreset {
    resetGame {
      success
      cardsLeftInDeck
      acesLeftInDeck
      gameStatus
      message
      deck {
        id
        suit
        rank
        status
      }
    }
  }
`;
