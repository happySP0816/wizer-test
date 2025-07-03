import axios from '@/services/interceptor'

interface PersonalityQuestion {
  question?: string
  answer?: string
}

export const getUserByUserName = async (username: string) => {
  try {
    const response = await axios.get(`/users/username/${username}`)

    return response.data
  } catch (error: any) {
    console.error(error.message)
  }
}

export const getAllCategories = async () => {
  try {
    const response = await axios.get(`/categories`)

    return response.data
  } catch (error) {
    return false
  }
}

export const getCategories = async (userId: number) => {
  try {
    const response = await axios.get(`/categories/user-categories/${userId}`)

    return response.data
  } catch (error) {
    return false
  }
}

export const getAllCategoriesByType = async () => {
  try {
    const response = await axios.get(`/categories/category/bytype`, {
      params: {
        viewType: 'business'
      }
    })

    return response.data
  } catch (error) {
    return false
  }
}

export const editCategories = async (ids: number[]) => {
  const payload = {
    categories: ids.map(id => ({
      id: id
    }))
  }

  try {
    const response = await axios.patch('/users/edit/categories', payload)

    return response.data
  } catch (error) {
    return false
  }
}

export const editUser = async (name: string, bio: string, birthday: number, location: string, gender: string) => {
  const payload = {
    name: name,
    bio: bio,
    birthday: birthday,
    location: location,
    gender: gender
  }
  try {
    const response = await axios.patch('/users/edit/public', payload)

    return response.data
  } catch (error) {
    return false
  }
}

export const editPassword = async (oldPassword: string, newPassword: string) => {
  const payload = {
    oldPassword,
    newPassword
  }

  try {
    const response = await axios.patch('/users/edit/password', payload)

    return response.data
  } catch (error) {
    return false
  }
}

// personality

export const getAllPersonalityQuestions = async () => {
  try {
    const response = await axios.get('/data/personality-questions')

    return response.data
  } catch (error) {
    return false
  }
}

export const getUserPersonalityQuestions = async () => {
  try {
    const response = await axios.get('users/personality')
    console.log("sdfsdfsdf", response)
    return response.data
  } catch (error) {
    return false
  }
}

export const editPersonalityQuestionsAnswers = async (personalityQuestionsAnswers: PersonalityQuestion[]) => {
  const payload = {
    personalityQuestionsAnswers: personalityQuestionsAnswers
  }

  try {
    const response = await axios.patch('/users/edit/personality', payload)

    return response.data
  } catch (error) {
    return false
  }
}

// Educations

export const getAllEducations = async () => {
  try {
    const response = await axios.get('/data/educations')

    return response.data
  } catch (error) {
    return false
  }
}

export const getUserEducation = async () => {
  try {
    const response = await axios.get('/users/educations')

    return response.data
  } catch (error) {
    return false
  }
}

export const setUserEducation = async (education: string) => {
  const payload = {
    educations: [education]
  }
  try {
    const response = await axios.patch('/users/edit/educations', payload)

    return response.data
  } catch (error) {
    return false
  }
}

// Professions
export const getAllProfessions = async () => {
  try {
    const response = await axios.get('/data/professions')

    return response.data
  } catch (error) {
    return false
  }
}

export const getUserProfession = async () => {
  try {
    const response = await axios.get('/users/professions')

    return response.data
  } catch (error) {
    return false
  }
}

export const setUserProfession = async (profession: string) => {
  const payload = {
    professions: [profession]
  }
  try {
    const response = await axios.patch('/users/edit/professions', payload)

    return response.data
  } catch (error) {
    return false
  }
}

// Ethnicities
export const getAllEthnicities = async () => {
  try {
    const response = await axios.get('/data/ethnicities')

    return response.data
  } catch (error) {
    return false
  }
}
export const getUserEthnicities = async () => {
  try {
    const response = await axios.get('/users/ethnicities')

    return response.data
  } catch (error) {
    return false
  }
}

export const setUserEthnicities = async (ethnicities: string[]) => {
  const payload = {
    ethnicities: ethnicities
  }
  try {
    const response = await axios.patch('/users/edit/ethnicities', payload)

    return response.data
  } catch (error) {
    return false
  }
}

// HobbiesOrInterests
export const getAllHobbiesOrInterests = async () => {
  try {
    const response = await axios.get('/data/hobbies-or-interests')

    return response.data
  } catch (error) {
    return false
  }
}

export const getUserHobbiesOrInterests = async () => {
  try {
    const response = await axios.get('/users/hobbiesOrInterests')

    return response.data
  } catch (error) {
    return false
  }
}

export const setUserHobbiesOrInterests = async (hobbiesOrInterests: string[]) => {
  const payload = {
    hobbiesOrInterests: hobbiesOrInterests
  }
  try {
    const response = await axios.patch('/users/edit/hobbiesOrInterests', payload)

    return response.data
  } catch (error) {
    return false
  }
}

export const deletePost = async (postId: any) => {
  try {
    const response = await axios.delete(`/posts/${postId}`);

    return response.data;
  } catch (error: any) {
    return false;
  }
};