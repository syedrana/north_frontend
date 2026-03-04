"use client";

import { useAuth } from "@/contexts/AuthContext";
import { fetchWishlistCount, toggleWishlist } from "@/services/wishlist.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useWishlist = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 🚨 user না থাকলে query চালাবো না
  const { data = 0, isLoading } = useQuery({
    queryKey: ["wishlist-count", user?._id],
    queryFn: fetchWishlistCount,
    enabled: !!user,
  });

  const mutation = useMutation({
    mutationFn: toggleWishlist,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist-count", user?._id],
      });
    },
  });

  return {
    count: data,
    loading: isLoading,
    toggle: mutation.mutate,
  };
};











