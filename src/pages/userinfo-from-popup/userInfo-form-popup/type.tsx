export type UserFields = {
  firstName: string
  lastName: string
  bio: string
  birthday: number
  gender: string
  location: string
}
export type UserErrors = {
  firstNameError: string
  lastNameError: string
  bioError: string
  birthdayError: string
  genderError: string
  locationError: string
}

export type ValidationRules = {
  required?: boolean
  minLength?: number
  errorMessage?: string
}

export interface UserProfile {
  username?: string
  bio?: string
  birthday?: string
  gender?: string
  location?: string
  educations?: Array<any>
  hobbiesOrInterests?: Array<any>
  ethnicities?: Array<any>
  professions?: Array<any>
}

export interface UserInfoMainProps {
  userProfile: UserProfile
}
