type MutationHookLike<TArg, TResult> = [
  (arg: TArg) => Promise<TResult>,
  {
    data?: TResult;
    error?: unknown;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    reset: () => void;
  }
];

export default MutationHookLike;