import {
  CreateGenerations,
  INewUser,
  IUpdateCredit,
  TrainingPayload,
  UploadTrainingStatus,
  UserPhotoshoot,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTraining,
  createUserAccount,
  createUserGeneration,
  createUserPhotoshoot,
  getAllGenerations,
  getAllTrainingData,
  getUserGenerations,
  getUserTrainingData,
  signInAccount,
  signOutAccount,
  updateUserCreditBalance,
  updateUserTrainingData,
} from "../appwrite/api";
import { QUERY_KEYS } from "./queryKeys";

// export const useGoogleOauth = () => {
//     return useMutation({
//         mutationFn: () => googleOauth(),
//       });
// }

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useUpdateUserCreditBalance = () => {
  return useMutation({
    mutationFn: (payload: IUpdateCredit) => updateUserCreditBalance(payload),
  });
};
export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: () => signOutAccount(),
  });
};

export const useCreateTraining = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TrainingPayload) => createTraining(data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_TRAINING_DATA],
      }),
  });
};

export const useCreateUserGeneration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGenerations) => createUserGeneration(data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_GENERATIONS],
      }),
  });
};

export const useCreateUserPhotoshoot = () => {
  return useMutation({
    mutationFn: (data: UserPhotoshoot) => createUserPhotoshoot(data),
  });
};

export const useGetAllTrainingData = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_TRAINING_DATA],
    queryFn: () => getAllTrainingData(),
    refetchOnWindowFocus: false,
  });
};

export const useUpdateUserTrainingData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UploadTrainingStatus) =>
      updateUserTrainingData(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_TRAINING_DATA],
      }),
  });
};

export const useGetUserTrainingData = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_TRAINING_DATA, userId],
    queryFn: () => getUserTrainingData(userId),
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });
};

export const useGetUserGenerations = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_GENERATIONS, userId],
    queryFn: () => getUserGenerations(userId),
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });
};

export const useGetAllGenerations = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_GENERATIONS],
    queryFn: () => getAllGenerations(),
    refetchOnWindowFocus: false,
  });
};
