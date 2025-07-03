import React, { useState, useEffect } from 'react'
import { editUser, getUserByUserName } from '@/apis/profile'
import { Input } from '@/components/components/ui/input'
import { Label } from '@/components/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/components/ui/select'
import { Textarea } from '@/components/components/ui/textarea'
import Loading from '@/components/loading'
import LoadingButton from '@/components/components/ui/loading-button'
import { toast } from 'sonner'

type UserFields = {
  firstName: string
  lastName: string
  bio: string
  birthday: string
  gender: string
  location: string
}
type UserErrors = {
  [K in keyof UserFields as `${K}Error`]: string
}
type EditUserDetailsProps = {
  onUserDataChange: (userData: UserFields) => void
  userProfile: any
}

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-Binary' },
  { value: 'other', label: 'Other' },
  { value: "I'd rather not say", label: "I'd rather not say" }
]

const EditUserDetails: React.FC<EditUserDetailsProps> = ({ onUserDataChange, userProfile }) => {
  const [user, setUser] = useState<UserFields>({
    firstName: '',
    lastName: '',
    bio: '',
    birthday: '',
    gender: '',
    location: ''
  })
  const [userErrors, setUserErrors] = useState<UserErrors>({
    firstNameError: '',
    lastNameError: '',
    bioError: '',
    birthdayError: '',
    genderError: '',
    locationError: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const splitName = (name: string) => {
    const [firstName, ...lastName] = name.split(' ').filter(Boolean)
    return {
      firstName: firstName || '',
      lastName: lastName.join(' ')
    }
  }

  const setUserData = async () => {
    setLoading(true)
    const username = userProfile.username
    const res = await getUserByUserName(username)
    if (res) {
      const { firstName, lastName } = splitName(res.user.name || '')
      setUser({
        firstName,
        lastName,
        bio: res.user.bio || '',
        birthday: res.user.birthday ? String(res.user.birthday) : '',
        gender: res.user.gender || '',
        location: res.user.location || ''
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    setUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const validateField = (field: keyof UserFields, value: string) => {
    let error = ''
    if (!value || value.trim() === '') {
      error = 'Field is required'
    } else if (field === 'bio' && value.length < 5) {
      error = 'Bio must be at least 5 characters'
    } else if (field === 'birthday' && value.length !== 4) {
      error = 'Year must be 4 digits'
    }
    setUserErrors(prev => ({ ...prev, [`${field}Error`]: error }))
    return !error
  }

  const validateForm = () => {
    let isValid = true;
    (Object.keys(user) as (keyof UserFields)[]).forEach((field: keyof UserFields) => {
      if (!validateField(field, user[field])) isValid = false
    })
    return isValid
  }

  const disableSave =
    Object.values(userErrors).some(error => error !== '') ||
    Object.values(user).some(value => value === '')

  const handleSaveUserData = async () => {
    if (validateForm()) {
      setSaving(true)
      const name = user.firstName + ' ' + user.lastName
      const res = await editUser(name, user.bio, Number(user.birthday), user.location, user.gender)
      if (res) {
        toast.success("Profile Edit Successful")
      } else {
        toast.error("Unable to Edit Profile")
      }
      setSaving(false)
    }
  }

  useEffect(() => {
    onUserDataChange(user)
  }, [user])

  if (loading) {
    return <Loading />
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-lg shadow p-8">
      <form
        className="space-y-6"
        onSubmit={e => {
          e.preventDefault()
          handleSaveUserData()
        }}
      >
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={user.firstName}
            onChange={e => setUser(prev => ({ ...prev, firstName: e.target.value }))}
            onBlur={e => validateField('firstName', e.target.value)}
            className="mt-1"
            required
          />
          {userErrors.firstNameError && (
            <div className="text-xs text-red-500 mt-1">{userErrors.firstNameError}</div>
          )}
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={user.lastName}
            onChange={e => setUser(prev => ({ ...prev, lastName: e.target.value }))}
            onBlur={e => validateField('lastName', e.target.value)}
            className="mt-1"
            required
          />
          {userErrors.lastNameError && (
            <div className="text-xs text-red-500 mt-1">{userErrors.lastNameError}</div>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={user.location}
              onChange={e => setUser(prev => ({ ...prev, location: e.target.value }))}
              onBlur={e => validateField('location', e.target.value)}
              className="mt-1"
              required
            />
            {userErrors.locationError && (
              <div className="text-xs text-red-500 mt-1">{userErrors.locationError}</div>
            )}
          </div>
          <div className="flex-1">
            <Label htmlFor="gender">Gender</Label>
            <Select value={user.gender} onValueChange={val => setUser(prev => ({ ...prev, gender: val }))}>
              <SelectTrigger id="gender" className="w-full mt-1">
                <SelectValue placeholder="Please Select" />
              </SelectTrigger>
              <SelectContent>
                {genderOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {userErrors.genderError && (
              <div className="text-xs text-red-500 mt-1">{userErrors.genderError}</div>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={user.bio}
            onChange={e => setUser(prev => ({ ...prev, bio: e.target.value }))}
            onBlur={e => validateField('bio', e.target.value)}
            className="mt-1"
            required
            maxLength={128}
            placeholder="About Me/ Professional Bio"
          />
          {userErrors.bioError && (
            <div className="text-xs text-red-500 mt-1">{userErrors.bioError}</div>
          )}
        </div>
        <div>
          <Label htmlFor="birthday">Birth Year</Label>
          <Input
            id="birthday"
            value={user.birthday}
            onChange={e => setUser(prev => ({ ...prev, birthday: e.target.value }))}
            onBlur={e => validateField('birthday', e.target.value)}
            className="mt-1"
            required
            maxLength={4}
            placeholder="Year of Birth"
            type="number"
          />
          {userErrors.birthdayError && (
            <div className="text-xs text-red-500 mt-1">{userErrors.birthdayError}</div>
          )}
        </div>
        <LoadingButton loading={saving} loadingText='saving profile' type="submit" className="w-full mt-6 flex items-center justify-center" disabled={disableSave || saving}>
          Save changes
        </LoadingButton>
      </form>
    </div>
  )
}

export default EditUserDetails
