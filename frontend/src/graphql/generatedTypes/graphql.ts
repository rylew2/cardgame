/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export enum CardStatus {
  /** Deck */
  Deck = 'DECK',
  /** Discarded */
  Discarded = 'DISCARDED',
  /** Hand */
  Hand = 'HAND',
}

export enum CardSuit {
  /** Club */
  Club = 'CLUB',
  /** Diamond */
  Diamond = 'DIAMOND',
  /** Heart */
  Heart = 'HEART',
  /** Spade */
  Spade = 'SPADE',
}

export type CardType = {
  __typename?: 'CardType';
  id: Scalars['ID']['output'];
  rank?: Maybe<Scalars['String']['output']>;
  status: CardStatus;
  suit: CardSuit;
};

export type DealCards = {
  __typename?: 'DealCards';
  acesLeftInDeck?: Maybe<Scalars['Int']['output']>;
  cardsLeftInDeck?: Maybe<Scalars['Int']['output']>;
  dealtCards?: Maybe<Array<Maybe<CardType>>>;
  deck?: Maybe<Array<Maybe<CardType>>>;
  gameStatus?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

/** Authentication mutation, deletes the session. */
export type LogoutUser = {
  __typename?: 'LogoutUser';
  success?: Maybe<Scalars['Boolean']['output']>;
};

/** Mutation wrapper for all mutations. */
export type Mutation = {
  __typename?: 'Mutation';
  /** Deal a certain count of cards from the deck to user's hand */
  dealCards?: Maybe<DealCards>;
  /** Log the user out. */
  logoutUser?: Maybe<LogoutUser>;
  /** Clear the db and reseed with a new game and deck */
  resetGame?: Maybe<ResetGame>;
};

/** Mutation wrapper for all mutations. */
export type MutationDealCardsArgs = {
  count: Scalars['Int']['input'];
};

/** Query wrapper for all queries. */
export type Query = {
  __typename?: 'Query';
  acesLeftInDeck?: Maybe<Scalars['Int']['output']>;
  cardsLeftInDeck?: Maybe<Scalars['Int']['output']>;
  gameStatus?: Maybe<Scalars['String']['output']>;
  me?: Maybe<User>;
};

export type ResetGame = {
  __typename?: 'ResetGame';
  acesLeftInDeck?: Maybe<Scalars['Int']['output']>;
  cardsLeftInDeck?: Maybe<Scalars['Int']['output']>;
  deck?: Maybe<Array<Maybe<CardType>>>;
  gameStatus?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

/** GraphQL type for the User model. */
export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username: Scalars['String']['output'];
};
