import React, { useEffect, useState } from 'react'
import { addTeam, getTeams, editTeam, deleteTeam } from '@/apis/teams'
import { Progress } from '@/components/components/ui/progress'
import { Input } from '@/components/components/ui/input'
import authRoute from '@/authentication/authRoute'
import { Button } from '@/components/components/ui/button'
import LoadingButton from '@/components/components/ui/loading-button'
import { Typography } from '@/components/components/ui/typography'
import { WizerGroupIcon } from '@/components/icons'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

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

interface PanelsProps {
  userProfile: UserProfileType
  user: MembershipType
}

const AllTeams: React.FC<PanelsProps> = (props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingCreate, setLoadingCreate] = useState<boolean>(false)
  const [editLoadingMap, setEditLoadingMap] = useState<Map<number, boolean>>(new Map())
  const [deleteLoadingMap, setDeleteLoadingMap] = useState<Map<number, boolean>>(new Map())

  const [isAddTeam, setIsAddTeam] = useState<boolean>(false)
  const [teamCardData, setTeamCardData] = useState<TeamData>({ name: '' })
  const [teams, setTeams] = useState<TeamData[]>([])
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [teamName, setTeamName] = useState<string>('')
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const orgId = props.user.small_decision.organization_id
  const navigate = useNavigate()

  // Helper functions to manage loading states
  const setEditLoading = (id: number, loading: boolean) => {
    setEditLoadingMap(prev => new Map(prev.set(id, loading)))
  }

  const setDeleteLoading = (id: number, loading: boolean) => {
    setDeleteLoadingMap(prev => new Map(prev.set(id, loading)))
  }

  const getEditLoading = (id: number) => editLoadingMap.get(id) || false
  const getDeleteLoading = (id: number) => deleteLoadingMap.get(id) || false

  const fetchTeams = async () => {
    setLoading(true)
    const res = await getTeams(orgId)
    if (res && res.length > 0) {
      const sortedTeams = res.sort((a: TeamData, b: TeamData) => a.name.localeCompare(b.name));
      setTeams(sortedTeams);
    } else {
      toast.error('Unable to fetch Groups Data')
    }
    setLoading(false)
  }

  const createTeam = async (name: string) => {
    setLoadingCreate(true)
    const res = await addTeam(name, orgId.toString())
    if (res.DecisionHubteam && res.DecisionHubteam.id) {
      setTeams(prevTeams => [...prevTeams, { name: name, id: res.DecisionHubteam.id }])
      toast.success('Group Creation Successful')
    } else {
      toast.error('Unable to create Group')
    }
    setIsAddTeam(false)
    setTeamCardData({ name: '' })
    setLoadingCreate(false)
  }

  useEffect(() => {
    fetchTeams()
  }, [])

  const editTeamName = async (name: string, id: number) => {
    setEditLoading(id, true)
    const res = await editTeam(name, id)
    if (res.DecisionHubteam && res.DecisionHubteam.id) {
      setIsEditing(false)
      setEditingTeamId(null)
      setTeamName('')
      setTeams(prevTeams => prevTeams.map(team => team.id === id ? { ...team, name } : team))
      toast.success('Group Name Edited')
    } else {
      toast.error('Unable to edit Group Name')
    }
    setEditLoading(id, false)
  }

  const removeTeam = async (id: number) => {
    setDeleteLoading(id, true)
    const res = await deleteTeam(id)
    if (res.result === true) {
      setDeleteLoading(id, false)
      setTeams(teams => teams.filter((team: TeamData) => team.id !== id))
      toast.success('Group Deleted')
    } else {
      setDeleteLoading(id, false)
      toast.error('Unable to delete Group')
    }
  }

  const handleAddMember = (team: TeamData) => {
    if (isEditing) {
      toast.error('Please save Group Details')
    } else {
      navigate(`/groups/add-members?name=${team.name}&id=${team.id}&organization_id=${props.user.small_decision.organization_id}`)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="!h-screen p-[30px] flex flex-col gap-8">
      <div className="flex items-center justify-between flex-none">
        <div className='flex items-center justify-center'>
          <div className='mr-3 text-primary'>
            <WizerGroupIcon size={32} style={{ width: '32px', height: '32px' }} />
          </div>
          <Typography className="flex items-center text-4xl font-bold">
            All Groups ({filteredTeams.length})
          </Typography>
        </div>
        <div className='flex items-center gap-2'>
          <Input
            placeholder="Search Groups..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="bg-transparent border border-primary text-primary ring-0 focus:!ring-0"
          />
          <div className="flex gap-2">
            <Button className='rounded-4xl' onClick={() => setIsAddTeam(true)}>
              Add new group
            </Button>
          </div>
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
              <div className="border-2 border-gray-300 rounded-lg p-6 my-6">
                <div className="mb-4 text-lg font-semibold text-gray-800">Create a new group</div>
                <div className="mb-4">
                  <label className="block font-medium mb-1">Group name</label>
                  <input
                    type='text'
                    onChange={e =>
                      setTeamCardData(cardData => {
                        return {
                          ...cardData,
                          name: e.target.value
                        }
                      })
                    }
                    value={teamCardData.name}
                    name='name'
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                </div>
                <div className="flex gap-4 justify-end">
                  <Button variant="outline" className='border border-primary hover:!border-primary' onClick={() => setIsAddTeam(false)}>Cancel</Button>
                  <LoadingButton
                    loading={loadingCreate}
                    loadingText="Creating..."
                    variant="default"
                    onClick={() => {
                      if (teamCardData.name) {
                        createTeam(teamCardData.name)
                      }
                    }}
                  >
                    Create group
                  </LoadingButton>
                </div>
              </div>
            )}
            {filteredTeams.length > 0 &&
              filteredTeams.map((team: TeamData) => {
                if (!team || team.id === undefined) return null;
                return (
                  <div key={team.id} className="border-2 border-primary rounded-lg p-6 my-6">
                    <div className="flex justify-between items-start gap-1.5">
                      {isEditing && editingTeamId === team.id ? (
                        <Input
                          value={teamName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTeamName(e.target.value)}
                          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            if (e.key === 'Enter' && team.id) {
                              teamName && editTeamName(teamName, team.id)
                            }
                          }}
                        />
                      ) : (
                        <Typography variant="h4" className="text-xl font-semibold text-gray-800">
                          {team.name}
                        </Typography>
                      )}
                      <div className="flex gap-2">
                        {isEditing && editingTeamId === team.id ? (
                          <LoadingButton
                            loading={getEditLoading(team.id as number)}
                            onClick={() => teamName && team.id && editTeamName(teamName, team.id)}
                            variant="outline" size="icon" className="border-primary">
                            <img src='/images/pages/teams/icon-save.svg' alt='save' width={15} height={15} />
                          </LoadingButton>
                        ) : (
                          <Button onClick={() => {
                            setIsEditing(true)
                            setEditingTeamId(team.id || null)
                            setTeamName(team.name)
                          }} variant="outline" size="icon" className="border-primary">
                            <img src='/images/pages/teams/pen-icon.svg' alt='pen' width={15} height={15} />
                          </Button>
                        )}
                        <LoadingButton
                          loading={getDeleteLoading(team.id as number)}
                          onClick={() => removeTeam(team.id as number)}
                          variant="outline" size="icon" className="border-primary">
                          <img src="/images/pages/teams/trash-icon.svg" alt="delete" className="w-5 h-5" />
                        </LoadingButton>
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
                      <Button variant="outline" className="border-primary" onClick={() => handleAddMember(team)}>
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
