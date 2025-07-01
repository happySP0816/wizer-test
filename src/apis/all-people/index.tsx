import customAxios from 'src/services/interceptor'

interface ChangeRoleParams {
  organizationId: number
  newRole?: string
  userId?: number
}

export const changePeopleRole = async (params: ChangeRoleParams): Promise<any> => {
  try {
    const response = await customAxios.post(
      `/organization/update/organization-member/role?organizationId=${params.organizationId}&newRole=${params.newRole}&userId=${params.userId}`
    )
    return response.data
  } catch (error) {
    throw error
  }
}
