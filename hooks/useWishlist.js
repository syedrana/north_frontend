"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
  fetchWishlistCount,
  fetchWishlistIds,
  toggleWishlist,
} from "@/services/wishlist.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useWishlist = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data = 0, isLoading } = useQuery({
    queryKey: ["wishlist-count", user?._id],
    queryFn: fetchWishlistCount,
    enabled: !!user,
  });

  const { data: wishlistIds = [] } = useQuery({
    queryKey: ["wishlist-items", user?._id],
    queryFn: fetchWishlistIds,
    enabled: !!user,
  });

  const mutation = useMutation({
    mutationFn: toggleWishlist,

    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["wishlist-items", user?._id] });
      await queryClient.cancelQueries({ queryKey: ["wishlist-count", user?._id] });

      const previousIds = queryClient.getQueryData(["wishlist-items", user?._id]) ?? [];
      const previousCount = queryClient.getQueryData(["wishlist-count", user?._id]) ?? 0;

      const alreadyExists = previousIds.includes(productId);
      const nextIds = alreadyExists
        ? previousIds.filter((id) => id !== productId)
        : [...previousIds, productId];

      queryClient.setQueryData(["wishlist-items", user?._id], nextIds);
      queryClient.setQueryData(["wishlist-count", user?._id], Math.max(nextIds.length, 0));

      return { previousIds, previousCount };
    },

    onError: (_err, _productId, context) => {
      if (!context) return;
      queryClient.setQueryData(["wishlist-items", user?._id], context.previousIds);
      queryClient.setQueryData(["wishlist-count", user?._id], context.previousCount);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist-items", user?._id],
      });
      queryClient.invalidateQueries({
        queryKey: ["wishlist-count", user?._id],
      });
    },
  });

  return {
    count: data,
    loading: isLoading,
    isInWishlist: (productId) => wishlistIds.includes(productId),
    toggle: mutation.mutate,
  };
};











