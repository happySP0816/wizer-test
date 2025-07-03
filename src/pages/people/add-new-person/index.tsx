import React, { useState } from 'react'
import { userSignUpDecisionHub, userCheck, attachMember } from '@/apis/people'
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/components/ui/button';
import { Typography } from '@/components/components/ui/typography';
import { toast } from 'sonner';
import { WizerTeamIcon } from '@/components/icons';
import { Input } from '@/components/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/components/ui/select';

const AddNewPerson: React.FC<any> = (props) => {
  const navigate = useNavigate();
  const orgId = new URLSearchParams(window.location.search).get('organization_id');
  const userId = new URLSearchParams(window.location.search).get('userId');
  const [personData, setPersonData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const userName = personData.firstName + '_' + personData.lastName
    const userRole = personData.role ? personData.role != 'team member' : 'user'
    const userExists = await userCheck(personData.email);
    if (userExists) {
      const res = await attachMember('external', Number(userExists), Number(orgId))
      if (res && res.id && res.name) {
        toast.success('New member added successfully', { icon: '✅' });
        setTimeout(() => {
          navigate(-1)
        }, 1500)
      } else if (res && res.error.message === 'User is already a member of this organization.') {
        toast.warning('User is already registered to your organisation');
      } else {
        toast.error('An error occurred. Please try again later.');
      }
    } else {
      const res = await userSignUpDecisionHub(personData.email, userName, Number(userId), Number(orgId), personData.role)
      if (res && res.user && res.user.id) {
        toast.success('New member added successfully', { icon: '✅' });
        setTimeout(() => {
          navigate(-1)
        }, 1500)
      } else if (res && res.error.message === 'email') {
        toast.warning('Email already registered');
      } else if (res && res.error.message === 'username') {
        toast.warning('Username already taken');
      } else {
        toast.error('An error occurred. Please try again later.');
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
    <div className="!h-screen p-[30px] flex flex-col gap-8">
      <div className="flex items-center justify-between flex-none">
        <div className='flex items-center justify-center'>
          <div className='mr-3 text-primary'>
            <WizerTeamIcon size={32} style={{ width: '32px', height: '32px' }} />
          </div>
          <Typography className="flex items-center text-4xl font-bold">
            Add new person
          </Typography>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className='rounded-4xl' onClick={() => navigate('/people')}>
            Cancel
          </Button>
        </div>
      </div>
      <div className='p-6'>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Typography variant="body1" className="font-semibold">First name</Typography>
            <Input type="text" value={personData.firstName} name="firstName" onChange={handleChange} className="border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary" required />
          </div>
          <div className="flex flex-col gap-2">
            <Typography variant="body1" className="font-semibold">Last name</Typography>
            <Input type="text" value={personData.lastName} name="lastName" onChange={handleChange} className="border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary" required />
          </div>
          <div className="flex flex-col gap-2">
            <Typography variant="body1" className="font-semibold">Email address</Typography>
            <Input type="email" value={personData.email} name="email" onChange={handleChange} className="border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary" required />
          </div>
          <div className="flex flex-col gap-2">
            <Typography variant="body1" className="font-semibold">Role</Typography>
            <Select value={personData.role} onValueChange={value => setPersonData(personData => ({ ...personData, role: value }))} required>
              <SelectTrigger className="w-full border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="external">external</SelectItem>
                <SelectItem value="user">team member</SelectItem>
                <SelectItem value="admin">admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="mt-4 self-center">Add person</Button>
        </form>
      </div>
    </div>
  )
}

export default AddNewPerson