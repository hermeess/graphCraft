import { apiSlice } from "./apiSlice";
const USERS_URL = "/api/users";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),
    getInfograph: builder.query({
      query: (user_id) => ({
        url: `${USERS_URL}/graphs/${user_id}`,
        method: "GET",
        invalidateTags: ["getInfograph"],
      }),
    }),
    updateInfoGraph: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/graphs`,
        method: "PUT",
        body: data,
      }),
    }),
    createInfoGraph: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/graphs`,
        method: "POST",
        body: data,
      }),
    }),
    deleteInfoGraph: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/graphs`,
        method: "DELETE",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useGetInfographQuery,
  useUpdateInfoGraphMutation,
  useCreateInfoGraphMutation,
  useDeleteInfoGraphMutation,
} = usersApiSlice;
