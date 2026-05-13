"use client";

import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export function useAI() {
  const searchMutation = useMutation({
    mutationFn: (query: string) =>
      apiFetch('/ai/search', {
        method: 'POST',
        body: JSON.stringify({ query }),
      }),
  });

  const stylistMutation = useMutation({
    mutationFn: (data: { productName: string; category?: string; style?: string; priceRange?: string; productId?: string }) =>
      apiFetch('/ai/stylist', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  });

  const summarizeReviewsMutation = useMutation({
    mutationFn: (productId: string) =>
      apiFetch(`/ai/reviews/${productId}/summary`, {
        method: 'GET',
      }),
  });

  return {
    parseSearch: searchMutation,
    getStylist: stylistMutation,
    summarizeReviews: summarizeReviewsMutation,
  };
}
