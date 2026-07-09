import { axiosInstanceManager } from "@growi/sdk-typescript";

export const InitializeGrowiApiClient = (authData: {
  appName: string;
  baseURL: string;
  token: string;
  authorizationHeader?: string;
}) => {
  axiosInstanceManager.addAxiosInstance(authData);
};
