import React, { useEffect, useState } from 'react'
import { addTeam, getTeams } from '@/apis/teams'
import { Progress } from '@/components/components/ui/progress'
import { Input } from '@/components/components/ui/input'
import authRoute from '@/authentication/authRoute'
import { Button } from '@/components/components/ui/button'
import TeamCard from '@/pages/all-teams/team-card'

interface TeamData {
  name: string
  numberOfParticipants?: number
  id?: number
}

type UserProfileType = {
  username: string;
  id: number;
}

type MembershipType = {
  small_decision: { organization_id: number };
  member_role: string;
}

type Props = {
  userProfile: UserProfileType // Use the defined UserProfileType
  user: MembershipType
}

interface PanelsProps {
  userProfile: UserProfileType
  user: MembershipType
}

const AllTeams: React.FC<PanelsProps> = (props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingCreate, setLoadingCreate] = useState<boolean>(false)
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
  const [snackbarMessage, setSnackbarMessage] = useState<string>('')
  const [severity, setSeverity] = useState<string>('success')

  const [isAddTeam, setIsAddTeam] = useState<boolean>(false)
  const [teamCardData, setTeamCardData] = useState<TeamData>({ name: '' })
  const [teams, setTeams] = useState<TeamData[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')

  const orgId = props.user.small_decision.organization_id

  const fetchTeams = async () => {
    setLoading(true)
    const res = await getTeams(orgId)
    if (res && res.length > 0) {
      const sortedTeams = res.sort((a: TeamData, b: TeamData) => a.name.localeCompare(b.name));
      setTeams(sortedTeams);
    } else {
      setSnackbarMessage('Unable to fetch Groups Data')
      setSeverity('error')
      setSnackbarOpen(true)
    }
    setLoading(false)
  }

  const createTeam = async (name: string) => {
    setLoadingCreate(true)
    const res = await addTeam(name, orgId.toString())

    if (res.DecisionHubteam.id) {
      fetchTeams()
      setSnackbarMessage('Group Creation Successful')
      setSeverity('success')
      setSnackbarOpen(true)
    } else {
      setSnackbarMessage('Unable to create Group')
      setSeverity('error')
      setSnackbarOpen(true)
    }

    setIsAddTeam(false)
    setTeamCardData({ name: '' })
    setLoadingCreate(false)
  }

  useEffect(() => {
    fetchTeams()
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen rounded-b-xl shadow">
      <div className="bg-purple-500 rounded-t-xl px-8 py-6 flex items-center justify-between">
        <h1 className="text-white text-2xl font-semibold">All Groups ({filteredTeams.length})</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Search Groups"
            value={searchQuery}
            onChange={handleSearchChange}
            className="bg-transparent border border-white text-white placeholder:text-white"
          />
          <Button variant="outline" className="border-purple-400 text-purple-500 hover:bg-purple-50" onClick={() => setIsAddTeam(true)}>
            Add new group
          </Button>
        </div>
      </div>
      <div className="p-6">
        {loading ? (
          <div>
            <Progress />
          </div>
        ) : (
          <div>
            {isAddTeam && (
              <div className="border-2 border-purple-400 rounded-lg p-6 my-6">
                <div className="mb-4 text-lg font-semibold text-gray-800">Create a new group</div>
                <div className="mb-4">
                  <label className="block font-medium mb-1">Group name</label>
                  <input
                    type='text'
                    onChange={e =>
                      setTeamCardData(cardData => {
                        return {
                          ...cardData,
                          [e.target.name]: e.target.value
                        }
                      })
                    }
                    value={teamCardData.name}
                    name='name'
                    className="border border-purple-400 rounded px-3 py-2 w-full"
                  />
                </div>
                <div className="flex gap-4 justify-end">
                  <Button variant="outline" className="border-purple-400 text-purple-500 hover:bg-purple-50" onClick={() => setIsAddTeam(false)}>Cancel</Button>
                  {loadingCreate ? (
                    <Progress />
                  ) : (
                    <Button
                      variant="outline"
                      className="border-purple-400 text-purple-500 hover:bg-purple-50"
                      onClick={() => {
                        if (teamCardData.name) {
                          createTeam(teamCardData.name)
                        }
                      }}
                    >
                      Create group
                    </Button>
                  )}
                </div>
              </div>
            )}
            {filteredTeams.length > 0 &&
              filteredTeams.map((team: TeamData) => {
                return (
                  <div key={team.id} className="border-2 border-purple-400 rounded-lg p-6 my-6">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-semibold text-gray-800">{team.name}</h2>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="border-purple-400 hover:bg-purple-50">
                          <img src="/images/pages/teams/pen-icon.svg" alt="edit" className="w-5 h-5" />
                        </Button>
                        <Button variant="outline" size="icon" className="border-purple-400 hover:bg-purple-50">
                          <img src="/images/pages/teams/trash-icon.svg" alt="delete" className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                    <hr className="my-4 border-purple-200" />
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-gray-700">Members</div>
                        <div className="text-gray-600 text-sm">
                          {team.numberOfParticipants === 0
                            ? 'This team currently has [no members]!'
                            : `This team currently has [${team.numberOfParticipants} members]!`}
                        </div>
                      </div>
                      <Button variant="outline" className="border-purple-400 text-purple-500 hover:bg-purple-50">
                        Add Members
                      </Button>
                    </div>
                  </div>
                )
              })}
            {!filteredTeams.length && (
              <div style={{ height: isAddTeam ? '20vh' : '50vh' }} className="flex flex-col items-center justify-center">
                <div className="text-lg font-semibold text-gray-700 mb-2">
                  You have 0 groups
                </div>
                <div className="text-gray-500">
                  Why don't you make a new one?
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default authRoute(AllTeams)
