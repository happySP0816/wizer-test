import type { UserFields, ValidationRules } from './type'

export const getValidationRules = (userField: keyof UserFields): ValidationRules => {
  const rules: { [key in keyof UserFields]: ValidationRules } = {
    firstName: { required: true, minLength: 1, errorMessage: 'First Name is required' },
    lastName: { required: true, minLength: 1, errorMessage: 'Last Name is required' },
    bio: { required: true, minLength: 5, errorMessage: 'Bio is required' },
    birthday: { required: true, minLength: 4, errorMessage: 'Year of birth is required' },
    gender: { required: true, minLength: 4, errorMessage: 'Gender is required' },
    location: { required: true, minLength: 1, errorMessage: 'Location is required' }
  }

  return rules[userField]
}

