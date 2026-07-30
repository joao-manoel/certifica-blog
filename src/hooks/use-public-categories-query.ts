"use client";

import { useQuery } from "@tanstack/react-query";

import { listPublicCategories } from "@/http/list-public-categories";

export function usePublicCategoriesQuery() {
  return useQuery({
    queryKey: ["posts", "categories"],
    queryFn: listPublicCategories,
    staleTime: 5 * 60 * 1000,
  });
}
