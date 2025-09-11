import {getToken} from "@/hooks/auth/useAuth";
import api, {APIResponse} from "@/lib/axios";
import {GetUser, UpdateUser} from "@/schemas/auth";


export const getProfile = async () => {
  const payload = getToken()

  if (!payload) {
    throw Error("Unauthorized");
  }

  const {data: user} = await api.get<APIResponse<GetUser>>(`/api/v1/users/${payload.UserID}`);
  console.log(user)
  return user
}

export const updateUser = (data: UpdateUser & {id: number}) => {
  const {id, ...update} = data
  return api.put<APIResponse<null>>(`/api/v1/users/${id}`, update)
}
