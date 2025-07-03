import React, { useEffect, useImperativeHandle, useState, forwardRef } from 'react';
import { Label } from '@/components/components/ui/label';
import { Input } from '@/components/components/ui/input';
import { editUser, getUserByUserName } from '@/apis/profile';
import type { UserErrors, UserFields, ValidationRules, UserProfile } from '../type';

interface BlankUserDetailsProps {
  onUpdateFormValidity(arg0: boolean): unknown;
  userProfile: UserProfile;
}

type UserState = {
  [key in keyof UserFields]: string;
} & { [key: string]: string };

const BlankUserDetails = forwardRef((props: BlankUserDetailsProps, ref) => {
  const [, setDisableSave] = useState(true);
  const [bioCharactersRemaining, setBioCharactersRemaining] = useState(254);
  const [userErrors, setUserErrors] = useState<UserErrors>({
    firstNameError: '',
    lastNameError: '',
    bioError: '',
    birthdayError: '',
    genderError: '',
    locationError: ''
  });

  const [user, setUser] = useState<UserState>({
    firstName: '',
    lastName: '',
    bio: '',
    birthday: '',
    gender: '',
    location: ''
  });

  const [initialUser, setInitialUser] = useState<UserState>({
    firstName: '',
    lastName: '',
    bio: '',
    birthday: '',
    gender: '',
    location: ''
  });

  const username = props.userProfile && props.userProfile.username;

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(null), 2000);
  };

  const checkEmptyFields = () => {
    for (const field in user) {
      if (user.hasOwnProperty(field) && !user[field]) {
        return true;
      }
    }
    return false;
  };

  const splitName = (name: string) => {
    if (name == null) {
      return {
        firstName: '',
        lastName: ''
      };
    }
    const [firstName, ...lastNameArr] = name.split(' ');
    return {
      firstName,
      lastName: lastNameArr.join(' ')
    };
  };

  const validateField = (userField: keyof UserFields, value: string, rules: ValidationRules) => {
    const { required, minLength } = rules;
    let error = '';
    if (required && !value) {
      error = 'Field is required';
    } else if (minLength && String(value).trim().length < minLength) {
      error = `Field must be at least ${minLength} characters long`;
    }
    setUserErrors(prevErrors => ({
      ...prevErrors,
      [`${userField}Error`]: error
    }));
    return !error;
  };

  const setUserData = async () => {
    const res = await getUserByUserName(username || '');
    if (res && res.user) {
      const { firstName, lastName } = splitName(res.user.name || '');
      const userData: UserState = {
        firstName: firstName || '',
        lastName: lastName || '',
        bio: res.user.bio || '',
        birthday: res.user.birthday ? String(res.user.birthday) : '',
        gender: res.user.gender || '',
        location: res.user.location || ''
      };
      setUser(userData);
      setInitialUser(userData);
      setBioCharactersRemaining(254 - (res.user.bio?.length || 0));
    }
  };

  useEffect(() => {
    setUserData();
    // eslint-disable-next-line
  }, []);

  const validateForm = () => {
    let isValid = true;
    (Object.keys(user) as (keyof UserFields)[]).forEach((userField) => {
      const value = user[userField];
      const rules = getValidationRules(userField);
      if (!validateField(userField, value, rules)) {
        isValid = false;
      }
    });
    const hasEmptyFields = checkEmptyFields();
    setDisableSave(!isValid || hasEmptyFields);
    props.onUpdateFormValidity(isValid && !hasEmptyFields);
    return isValid && !hasEmptyFields;
  };

  const handleSaveUserData = async () => {
    return new Promise(async (resolve, reject) => {
      if (validateForm()) {
        const name = `${user.firstName} ${user.lastName}`;
        const res = await editUser(name, user.bio, Number(user.birthday), user.location, user.gender);
        if (res) {
          showToast('Profile Update Successful', 'success');
          setInitialUser(user);
          resolve(true);
        } else {
          showToast('Unable to update Profile', 'error');
          reject(false);
        }
      } else {
        reject(false);
      }
    });
  };

  useImperativeHandle(ref, () => ({
    handleSaveUserData
  }));

  const handleChangeGender = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setUser(prevUser => ({
      ...prevUser,
      gender: event.target.value as string
    }));
  };

  const handleFieldChange = (field: keyof UserFields) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    if (field === 'bio') {
      if (value.length <= 254) {
        setUser((prevUser) => ({
          ...prevUser,
          [field]: value,
        }));
        setBioCharactersRemaining(254 - value.length);
      }
    } else {
      setUser((prevUser) => ({
        ...prevUser,
        [field]: value,
      }));
    }
    setUserErrors(prevErrors => ({
      ...prevErrors,
      [`${field}Error`]: ''
    }));
    validateField(field, String(value), getValidationRules(field));
    const hasValue = Object.values(user).every(value => String(value)?.trim() !== '');
    setDisableSave(!hasValue);
    props.onUpdateFormValidity(hasValue && validateForm());
  };

  const renderTextField = (
    field: keyof UserFields,
    label: string,
    required = true,
    type = 'text',
    placeholder = ''
  ) => {
    if (initialUser[field]) return null;
    return (
      <div className="mb-4 w-full">
        <Label htmlFor={`${field}-basic`} className="block mb-1 font-medium">{label}</Label>
        {field === 'bio' ? (
          <textarea
            value={user[field] || ''}
            onChange={handleFieldChange(field)}
            id={`${field}-basic`}
            required={required}
            placeholder={placeholder}
            maxLength={254}
            rows={4}
            className={`w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-primary ${userErrors[`${field}Error`] ? 'border-red-500' : 'border-gray-300'}`}
            onBlur={() => validateField(field, user[field] || '', getValidationRules(field))}
          />
        ) : (
          <Input
            value={user[field] || ''}
            onChange={handleFieldChange(field)}
            id={`${field}-basic`}
            required={required}
            placeholder={placeholder}
            type={type}
            className={`w-full ${userErrors[`${field}Error`] ? 'border-red-500' : ''}`}
            onBlur={() => validateField(field, user[field] || '', getValidationRules(field))}
          />
        )}
        {userErrors[`${field}Error`] && (
          <div className="text-xs text-red-500 mt-1">{userErrors[`${field}Error`]}</div>
        )}
        {field === 'bio' && (
          <div className="text-xs text-gray-500 text-right">{bioCharactersRemaining} characters remaining</div>
        )}
      </div>
    );
  };

  const getValidationRules = (userField: keyof UserFields): ValidationRules => {
    const rules: { [key in keyof UserFields]: ValidationRules } = {
      firstName: { required: true, minLength: 1, errorMessage: 'First Name is required' },
      lastName: { required: true, minLength: 1, errorMessage: 'Last Name is required' },
      bio: { required: true, minLength: 5, errorMessage: 'Bio is required' },
      birthday: { required: true, minLength: 3, errorMessage: 'Year of birth is required' },
      gender: { required: true, minLength: 4, errorMessage: 'Gender is required' },
      location: { required: true, minLength: 1, errorMessage: 'Location is required' }
    };
    return rules[userField];
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-xl mx-auto mt-8 w-full">
      {toastMsg && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded shadow-lg text-white ${toastType === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>{toastMsg}</div>
      )}
      <div className="bg-white rounded-lg shadow p-8 w-full">
        {renderTextField('firstName', 'First name')}
        {renderTextField('lastName', 'Last name')}
        <div className="flex flex-row gap-4 w-full mb-4">
          {renderTextField('location', 'Location')}
          {!initialUser.gender && (
            <div className="w-1/2">
              <Label htmlFor="gender-select" className="block mb-1 font-medium">Gender</Label>
              <select
                id="gender-select"
                value={user.gender || ''}
                required
                onChange={handleChangeGender}
                onBlur={() => validateField('gender', user.gender || '', getValidationRules('gender'))}
                className={`w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-primary ${userErrors.genderError ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Please Select</option>
                <option value={'male'}>Male</option>
                <option value={'female'}>Female</option>
                <option value={'non-binary'}>Non-Binary</option>
                <option value={'other'}>Other</option>
                <option value={"I'd rather not say"}>I'd rather not say</option>
              </select>
              {userErrors.genderError && (
                <div className="text-xs text-red-500 mt-1">{userErrors.genderError}</div>
              )}
            </div>
          )}
        </div>
        {renderTextField('bio', 'Bio', true, 'text', 'About Me/ Professional Bio')}
        {renderTextField('birthday', 'Birth Year', true, 'number', 'Year of Birth')}
      </div>
    </div>
  );
});

export default BlankUserDetails;
