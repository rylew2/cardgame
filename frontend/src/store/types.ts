import { Card } from '../common/cardUtil';

export interface DealAction {
  hand: Card[];
  deck: Card[];
}

export interface ResetAction {
  deck: Card[];
  hand: Card[];
}

export interface GameState {
  deck: Card[]; // initialized as 52 card deck
  hand: Card[]; // initialized as random 5 card hand
  cardsLeft: number; // cards left in the deck
  acesLeft: number; // aces left in the deck
  gamePhase: GamePhase; // Loading, InProgress, Won, Lost
}

export enum GamePhase {
  InProgress = 'In Progress',
  Won = 'Won',
  Lost = 'Lost',
  Loading = 'Loading',
}
