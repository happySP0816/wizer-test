import React, { useEffect, useState } from 'react'
import { addTeam, getTeams } from '@/apis/teams'
import { Progress } from '@/components/components/ui/progress'
import { Input } from '@/components/components/ui/input'
import TeamCard from '@/pages/all-teams/team-card'
import authRoute from '@/authentication/authRoute'
import { Button } from '@/components/components/ui/button'

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
    <div>
      <div>
        <div>
          <div>
            All Groups ({filteredTeams.length})
          </div>
          <Input
            placeholder="Search Groups"
            value={searchQuery}
            onChange={handleSearchChange}
            className="text-white border-white placeholder:text-white"
          />
          <Button onClick={() => setIsAddTeam(true)}>Add new group</Button>
        </div>
        {loading ? (
          <div>
            <Progress />
          </div>
        ) : (
          <div>
            {isAddTeam && (
              <div>
                <div>
                  <div>
                    Create a new group
                  </div>
                  <div>
                    <div>
                      Group name
                    </div>
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
                    />
                  </div>
                  <div>
                    <div onClick={() => setIsAddTeam(false)}>Cancel</div>
                    {loadingCreate ? (
                      <div>
                        <Progress />
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          if (teamCardData.name) {
                            createTeam(teamCardData.name)
                          }
                        }}
                      >
                        Create group
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {filteredTeams.length > 0 &&
              filteredTeams.map((team: TeamData) => {
                return (
                  <TeamCard
                    key={team.id}
                    teamData={team}
                    setTeams={setTeams}
                    setSnackbarOpen={setSnackbarOpen}
                    setSnackbarMessage={setSnackbarMessage}
                    setSeverity={setSeverity}
                    user={props.user}
                    userProfile={props.userProfile}
                  />
                )
              })}
            {!filteredTeams.length && (
              <div style={{ height: isAddTeam ? '20vh' : '50vh' }}>
                <div>
                  You have 0 groups
                </div>
                <div>
                  Why don't you make a new one?
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {snackbarOpen && (
        <div>
          {snackbarMessage}
        </div>
      )}
    </div>
  )
}

export default authRoute(AllTeams)
