import customAxios from '@/services/interceptor';

export const getdecisionProfile = async (payload: any) => {
  try {
    const response = await customAxios.post(
      "/DecisionProfile/check/user/Decision-profile",
      payload
    );

    return response.data;
  } catch (error) {
    throw new Error("Failed to check decision profile status");
  }
};

export const getdecisionProfileStatus = async (userId: number) => {
  try {
    const response = await customAxios.post(
      "/DecisionProfile/check/user/Decision-profile-status?userId=" + userId
    );

    return response.data;
  } catch (error) {
    throw new Error("Failed to check decision profile status");
  }
};

export const getdecisionProfilePercentages = async (userId: number) => {
  try {
    const response = await customAxios.get(
      "/DecisionProfile/calculate-quiz-percentage?userId=" + `${userId}`
    );
    
    return response.data;
  } catch (error) {
    throw new Error("Failed to check decision profile status");
  }
};

export const getOrganizationTypes = async () => {
  try {
    const response = await customAxios.patch(
      "/organization/get/organizationType"
    );
    
    return response.data;
  } catch (error) {
    throw new Error("Failed to retrieve organizationType");
  }
};

export const getOrganizationQuestions = async (typeId: number) => {
  try {
    const response = await customAxios.get(
      "/DecisionProfile/get/organization-question?typeId=" + `${typeId}`
    );
    
    return response.data;
  } catch (error) {
    throw new Error("Failed to retrieve organizationQuestions");
  }
};

export const saveUserDetailsAndOrganiztionQuestions = async (payload: any) => {
  try {
    const response = await customAxios.post(
      "DecisionProfile/start/Decision-profile",
      payload
    );
    
    return response.data;
  } catch (error) {
    throw new Error("Failed save data");
  }
};
export const getDecisionProfileQuestion = async () => {
  try {
    const response = await customAxios.get("DecisionProfile/get/decision-profile-question");
    const datares = response.data.sort(function (_a: any, _b: any) {return Math.random() - 0.5;});
    
    return datares;

  } catch (error) {
    throw new Error("Failed save data");
  }
};

export const getUpdatedDecisionProfileQuestion = async () => {
  try {
    const response = await customAxios.get("DecisionProfile/get/updated-decision-profile-question");
    const datares = response.data.sort(function (_a: any, _b: any) {return Math.random() - 0.5;});
    
    return datares;

  } catch (error) {
    throw new Error("Failed save data");
  }
};

export const updateDecisionProfileAnswer = async (requestData: any) => {
  try {
    const response = await customAxios.patch("DecisionProfile/update/decision-profile-answer", requestData);
    
    return response.data;
  } catch (error) {
    throw new Error("Failed to save data");
  }
};