import customAxios from 'src/services/interceptor';

export const fetchNotifications = async (payload: any, offset: any): Promise<any> => {
  const response = await customAxios.get("/inbox");

  return response.data;
};

export const countNotifications = async (): Promise<any> => {
  const response = await customAxios.get("/inbox/number-of-inbox-notifications");

  return response.data;
};

export const readNotification = async (payload: any): Promise<any> => {
  const response = await customAxios.patch("/inbox/read-inbox-notification", payload);
  
  return response.data;
};