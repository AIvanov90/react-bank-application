import { useQuery } from "@tanstack/react-query";
import { fetchBranchesRaw, normalizeBranches, type Branch } from "./banches";

export function useBranches() {
  return useQuery<Branch[]>({
    queryKey: ["branches"],
    queryFn: async ({ signal }) => {
      const raw = await fetchBranchesRaw(signal);
      return normalizeBranches(raw);
    },
    staleTime: 5 * 60 * 1000, // cache 5 min
  });
}
