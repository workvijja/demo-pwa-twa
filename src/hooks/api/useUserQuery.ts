import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getProfile, updateUser} from "@/services/userService";

export const useProfileQuery = () => {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: getProfile,
    select: (res) => res.data
  })
}

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["user"]})
    }
  })
}
