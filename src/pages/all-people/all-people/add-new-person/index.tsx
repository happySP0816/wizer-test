import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AllPeopleMain, DarkBtn, NavBarBtn, NavBarTitle, PeopleContainer } from '../styles/style-all-people-common'
import PeopleNavbar from '../components/people-navbar'
import { AddNewBox, AddNewForm, AddNewInput, AddNewInputLabel } from '../styles/style-add-person'
import { userSignUpDecisionHub, userCheck, attachMember } from '@/apis/people'
import { Button } from '@/components/components/ui/button'

const searchIcon = (
  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
    <path
      fill-rule='evenodd'
      clip-rule='evenodd'
      d='M4 11C4 7.13401 7.13401 4 11 4C14.866 4 18 7.13401 18 11C18 12.8858 17.2543 14.5974 16.0417 15.8561C16.0073 15.8825 15.9743 15.9114 15.9428 15.9429C15.9113 15.9744 15.8824 16.0074 15.856 16.0418C14.5973 17.2543 12.8857 18 11 18C7.13401 18 4 14.866 4 11ZM16.6176 18.0319C15.078 19.2635 13.125 20 11 20C6.02944 20 2 15.9706 2 11C2 6.02944 6.02944 2 11 2C15.9706 2 20 6.02944 20 11C20 13.125 19.2635 15.0781 18.0319 16.6177L21.707 20.2929C22.0975 20.6834 22.0975 21.3166 21.707 21.7071C21.3165 22.0976 20.6833 22.0976 20.2928 21.7071L16.6176 18.0319Z'
      fill='#000'
    />
  </svg>
)

const AddNewPerson: React.FC<any> = (props: any) => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const orgId = searchParams.get('organization_id')
  const userId = searchParams.get('userId')
  const router = useNavigate()
  const [personData, setPersonData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: ''
  })
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
  const [snackbarMessage, setSnackbarMessage] = useState<string>('')
  const [severity, setSeverity] = useState<string>('success')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const userName = personData.firstName + '_' + personData.lastName
    const userRole = personData.role ? personData.role != 'team member' : 'user'
    const userExists = await userCheck(personData.email);
    // console.log('userExists', userExists);
    if (userExists) {
      const res = await attachMember('external', Number(userExists), Number(orgId))
      if (res && res.id && res.name) {
        setSnackbarOpen(true)
        setSeverity('success')
        setSnackbarMessage('New member added successfully')
        setTimeout(() => {
          router(-1)
        }, 1500)
      } else if (res && res.error.message === 'User is already a member of this organization.') {
        setSnackbarOpen(true)
        setSeverity('error')
        setSnackbarMessage('User is already registered to your organisation')
      } else {
        setSnackbarOpen(true)
        setSeverity('error')
        setSnackbarMessage('An error occurred. Please try again later.')
      }
    } else {
      const res = await userSignUpDecisionHub(personData.email, userName, Number(userId), Number(orgId),personData.role)
      if (res && res.user && res.user.id) {
        setSnackbarOpen(true)
        setSeverity('success')
        setSnackbarMessage('New member added successfully')
        setTimeout(() => {
          router(-1)
        }, 1500)
      } else if (res && res.error.message === 'email') {
        setSnackbarOpen(true)
        setSeverity('error')
        setSnackbarMessage('Email already registered')
      } else if (res && res.error.message === 'username') {
        setSnackbarOpen(true)
        setSeverity('error')
        setSnackbarMessage('Username already taken')
      } else {
        setSnackbarOpen(true)
        setSeverity('error')
        setSnackbarMessage('An error occurred. Please try again later.')
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setPersonData(personData => {
      return {
        ...personData,
        [name]: value
      }
    })
  }

  return (
    <AllPeopleMain>
      <PeopleContainer>
        <PeopleNavbar margin={20}>
          <NavBarTitle>Add new person</NavBarTitle>
          <Button variant="outline" onClick={() => router(-1)}>
            Cancel
          </Button>
        </PeopleNavbar>
        <AddNewBox>
          <AddNewForm onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <AddNewInputLabel>First name</AddNewInputLabel>
              <AddNewInput type='text' value={personData.firstName} name='firstName' onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-2">
              <AddNewInputLabel>Last name</AddNewInputLabel>
              <AddNewInput type='text' value={personData.lastName} name='lastName' onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-2">
              <AddNewInputLabel>Email address</AddNewInputLabel>
              <AddNewInput type='email' value={personData.email} name='email' onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-2">
              <AddNewInputLabel>Role</AddNewInputLabel>
              <select value={personData.role} name='role' onChange={handleChange} className="h-12 rounded-md border-2 border-[#CBD2E0] p-3 text-base font-normal leading-[150%]">
                <option value='external'>external</option>
                <option value='user'>team member</option>
                <option value='admin'>admin</option>
              </select>
            </div>
            {/* <Stack gap='8px'>
            <AddNewInputLabel>Team</AddNewInputLabel>
            <Stack direction='row' alignItems='center'>
              <AddNewInput
                type='text'
                name='team'
                value={personData.team}
                onChange={handleChange}
                placeholder='Search for team...'
                style={{ width: '100%' }}
              />
              <Box ml='-36px' display='flex' alignItems='center'>
                {searchIcon}
              </Box>
            </Stack>
          </Stack> */}
            <DarkBtn type='submit' style={{ marginLeft: 0, marginTop: '20px', alignSelf: 'center' }}>
              Add person
            </DarkBtn>
          </AddNewForm>
        </AddNewBox>
      </PeopleContainer>
  
    </AllPeopleMain>
  )
}

export default AddNewPerson