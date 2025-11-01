import { useCallback, useEffect, useState } from "react";

type Configs<T> = {
  initialFetch?: boolean;
  initialData?: null | T;
};
const DEFAULT_CONFIG: Configs<unknown> = {
  initialFetch: true,
};
const useFetch = <T>(
  cb: () => Promise<T>,
  {
    initialFetch = true,
    initialData,
  }: Configs<T> = DEFAULT_CONFIG as Configs<T>
) => {
  const [loading, setLoading] = useState(initialFetch || false);
  const [error, setError] = useState<null | Error>(null);
  const [data, setData] = useState<null | T>(initialData || null);
  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await cb();
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred !")
      );
    } finally {
      setLoading(false);
    }
  }, [cb]);
  const reset = () => {
    setLoading(false);
    setError(null);
    setData(initialData || null);
  };
  useEffect(() => {
    if (initialFetch) refetch();
  }, [initialFetch, refetch]);

  return {
    loading,
    error,
    isError: !!error,
    data,
    refetch,
    reset,
  };
};

export default useFetch;
