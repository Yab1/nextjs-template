import type { QueryClient, QueryKey } from "@tanstack/react-query";

type Rollback = {
  previous: unknown;
};

export function optimisticOptions<T>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  update: (current: T | undefined) => T
) {
  return {
    onMutate: async (): Promise<Rollback> => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<T>(queryKey);
      queryClient.setQueryData<T>(queryKey, (current) => update(current));
      return { previous };
    },
    onError: (_error: unknown, _variables: unknown, context?: Rollback) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey });
    },
  };
}
