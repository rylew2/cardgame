import { useMutation } from '@apollo/client';
import { DealCards, ResetGame } from './generatedTypes/graphql';
import { DEAL_CARDS_MUTATION, RESET_GAME_MUTATION } from './mutations/mutations';

interface GraphQLServiceInterface {
  dealCardsMutation: (count: number) => Promise<DealCardsMutationResult>;
  resetMutation: () => Promise<ResetGameMutationResult>;
}

export type DealCardsMutationResult = DealCards | null;
export type ResetGameMutationResult = ResetGame | null;

function GraphQLService(): GraphQLServiceInterface {
  const [dealCardsMutation] = useMutation<{ dealCards: DealCards }>(DEAL_CARDS_MUTATION);
  const [resetMutation] = useMutation<{ resetGame: ResetGame }>(RESET_GAME_MUTATION);

  return {
    dealCardsMutation: async (count: number) => {
      try {
        const { data } = await dealCardsMutation({ variables: { count } });
        if (data && data.dealCards) {
          return data.dealCards;
        }
        return null;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    resetMutation: async () => {
      try {
        const { data } = await resetMutation();
        if (data && data.resetGame) {
          return data.resetGame;
        }
        return null;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  };
}

export default GraphQLService;
