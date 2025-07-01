import React, { useEffect, useState } from 'react'
import { Button } from '@/components/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/components/ui/dialog'
import PeopleNavbar from './components/people-navbar'
import { useNavigate } from 'react-router-dom'
import {
  AllPeopleMain,
  ImgBtn,
  NavBarBtn,
  NavBarTitle,
  PeopleContainer,
  ProgressBox,
  StackContainer
} from './styles/style-all-people-common'
import {
  tableCellBorder,
  AllPeopleTableBox,
  TableText,
  AllPeopleTableCell,
  WhiteBtnCard
} from './styles/style-all-people'

import { getOrganizationMembersForPeople } from '@/apis/people'
import { userSignUpDecisionHub, attachMember, userCheck, removeMemberApi } from '@/apis/people'
import Papa from 'papaparse'
import { changePeopleRole } from '@/apis/all-people'

type UserProfileType = {
  username: string
  id: number
}

type MembershipType = {
  organization_id: number
  member_role: string
}

type MemberType = {
  organization_member_id: number
  user: number
  username: string
  email: string
  teamDetails: { teamName: string }[] | null
  organizationId: number
  organization_member_role: string
  organization_member_status: string
  decisionProfileComplete: boolean
  decisionProfileType: string
}

type Props = {
  userProfile: UserProfileType // Use the defined UserProfileType
  user: any
}

const AllPeople: React.FC<Props> = (props: any) => {
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberType | null>(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }
  const columns = ['Username', 'email', 'Group', 'Role', 'Status', 'Profile', 'Decision', 'Actions']
  const [members, setMembers] = useState<MemberType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
  const [snackbarMessage, setSnackbarMessage] = useState<string>('')
  const [severity, setSeverity] = useState<string>('success')

  const handleOpenDialog = (member: MemberType) => {
    setSelectedMember(member);
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMember(null);
  };

  const handleConfirmRemove = () => {
    if (selectedMember) {
      removeMember(selectedMember.user, selectedMember.organizationId);
      handleCloseDialog();
    }
  };

  const removeMember = (user: number, orgId: number) => {
    removeMemberApi(user, orgId)
      .then(() => {
        setMembers(prevMembers => prevMembers.filter(member => member.user !== user));
      })
      .catch(error => {
      });
  };

  const orgId = props.user.small_decision.organization_id

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      // // console.log('at file')
      setShowInput(!showInput)
      const file = e.target.files?.[0];
      // // console.log('file is: ', file)
      if (file) {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: async (results) => {
            if (results.errors.length > 0) {
              setSeverity('error')
              setSnackbarMessage('File is empty')
              setSnackbarOpen(true)

              return // Stop further processing if there are errors
            }

            // Define the expected column names
            const expectedColumns = ['firstName', 'lastName', 'email', 'role']; // Adjust as needed
            
            // Check if the actual header columns match the expected ones
            const actualColumns = Object.keys(results.data[0] as any);
            const missingColumns = expectedColumns.filter(col => !actualColumns.includes(col));
            
            if (missingColumns.length > 0) {
              setSeverity('error')
              setSnackbarMessage('Missing columns in CSV file:' + String(missingColumns))
              setSnackbarOpen(true)

              // Show an error message to the user or handle it accordingly

              return // Stop further processing if columns are missing
            }
            // Process CSV data here

            // // console.log('results', results.data)
            let count = 0
            const csvCount = results.data.length

            // Create an array to store all the API call promises
            const apiCallPromises = results.data.map(async (person: any) => {
              const userName = person.firstName + '_' + person.lastName
              const userExists = await userCheck(person.email)
              if (userExists) {
                const res = await attachMember('external', Number(userExists), Number(orgId))
                if (res && res.id) {

                  // // console.log('yes')
                  count += 1

                  // // console.log('current count: ', count)
                }
              } else {
                const res = await userSignUpDecisionHub(
                  person.email,
                  userName,
                  Number(props.userProfile.id),
                  Number(orgId),
                  person.role
                )
                if (res && res.user && res.user.id) {

                  // // console.log('yes')

                  count += 1

                  // // console.log('current count: ', count)
                }
              }
            })

            // Wait for all the API calls to complete
            await Promise.all(apiCallPromises)

            setSeverity('success')
            setSnackbarMessage(count + ' People added successfully from ' + csvCount)
            setSnackbarOpen(true)
          }, 
          error: (error) => {
            setSeverity('error')
            setSnackbarMessage(error.message)
            setSnackbarOpen(true)
          }
        })
      }
    } catch (error) {
      console.error('Error in handleFileChange:', error);
    }
  }

  const fetchAllMembers = async () => {
    setLoading(true)
    const res = await getOrganizationMembersForPeople(Number(orgId))
    if (res && res.length > 0) {
      setMembers(res)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAllMembers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAddPeople = () => {
    navigate(`/all-people/add-new-person?organization_id=${props.user.small_decision.organization_id}&userId=${props.userProfile.id}`)
  }

  const [showInput, setShowInput] = useState(false)

  const handleToggleInput = () => {
    if (!showInput) {
      setShowInput(!showInput)
    }
  }

  const handleRoleChange = async (event: any, orgId: number, userId: number) => {
    const newRole = event.target.value as string

    try {
      const result = await changePeopleRole({
        organizationId: orgId,
        newRole: newRole,
        userId: userId
      })
      if (result) {
        return (
          fetchAllMembers(),
          setSnackbarOpen(true),
          setSeverity('success'),
          setSnackbarMessage('User role has been updated successfully.')
        )
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <PeopleNavbar margin={35}>
          <h2 className="text-2xl font-bold">All People ({members.length})</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleToggleInput}>
              {showInput ? (
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                />
              ) : (
                'Upload CSV File'
              )}
            </Button>
            <Button onClick={handleAddPeople}>Add new person</Button>
          </div>
        </PeopleNavbar>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((col, index) => (
                    <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1 font-bold">
                        {col}
                        {col !== 'Actions' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                            <path d="M5.00049 7.49976L10.0009 12.5002L15.0013 7.49976" stroke="#3D3D3D" strokeWidth="1.66678" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {members.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((member, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.teamDetails === null ? (
                        <span className="inline-block px-2 py-1 bg-gray-200 rounded text-xs">Unassigned</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {member.teamDetails.map((teamDetail, idx) => (
                            <span key={idx} className="inline-block px-2 py-1 bg-violet-100 rounded text-xs">{teamDetail.teamName}</span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <select
                        className="border rounded px-2 py-1 text-sm"
                        value={member.organization_member_role}
                        onChange={(event) => handleRoleChange(event, member.organizationId, member.user)}
                      >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                        <option value="external">External</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${member.organization_member_status === 'created' ? 'bg-violet-100 text-violet-800' : 'bg-pink-100 text-pink-800'}`}>
                        {member.organization_member_status === 'created' ? 'created' : 'registered'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${member.decisionProfileComplete ? 'bg-violet-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                        {member.decisionProfileComplete ? 'Completed' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {member.decisionProfileType && (
                        <img src={`/images/decision-profile/${member.decisionProfileType}.png`} alt="profile" className="w-16 h-16 object-contain" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button variant="destructive" size="sm" onClick={() => handleOpenDialog(member)}>
                        <img src="/images/pages/teams/trash-icon.svg" alt="delete" className="w-5 h-5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination can be refactored similarly if needed */}
          </div>
        )}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure you want to remove this member?</DialogTitle>
              <DialogDescription>
                {selectedMember ? `Username: ${selectedMember.username}, Email: ${selectedMember.email}` : ''}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
              <Button variant="destructive" onClick={handleConfirmRemove}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default AllPeople
