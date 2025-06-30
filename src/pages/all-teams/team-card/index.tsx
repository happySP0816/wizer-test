import React, { useState } from 'react'
import { deleteTeam, editTeam } from '@/apis/teams'
import { Input } from '@/components/components/ui/input'
import { Button } from '@/components/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Typography } from '@/components/components/ui/typography'
import { Progress } from '@/components/components/ui/progress'


interface TeamData {
  name: string
  numberOfParticipants?: number
  id?: number
}
interface ITeamCard {
  teamData: TeamData
  setTeams: React.Dispatch<React.SetStateAction<TeamData[]>>
  setSnackbarOpen: (open: boolean) => void
  setSnackbarMessage: (message: string) => void
  setSeverity: (severity: string) => void
  user: any
  userProfile: any
}

const TeamCard: React.FC<ITeamCard> = ({
  teamData,
  setTeams,
  setSnackbarOpen,
  setSnackbarMessage,
  setSeverity,
  user,
  userProfile
}) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)

  const [isEditing, setIsEditing] = useState(false)
  const [teamName, setTeamName] = useState(teamData.name)

  const editTeamName = async (name: string) => {
    if (teamData.id === undefined) return;
    setLoading(true)
    const res = await editTeam(name, teamData.id)

    if (res.DecisionHubteam.id) {
      setSnackbarMessage('Team Name Edited')
      setSeverity('success')
      setSnackbarOpen(true)
      setIsEditing(false)
    } else {
      setSnackbarMessage('Unable to edit Team Name')
      setSeverity('error')
      setSnackbarOpen(true)
    }
    setLoading(false)
  }

  const removeTeam = async (id: number) => {
    setLoading(true)
    const res = await deleteTeam(id)
    if (res.result === true) {
      setSnackbarMessage('Team Deleted')
      setSeverity('success')
      setSnackbarOpen(true)
      setLoading(false)
      setTeams((prevTeams: TeamData[]) => prevTeams.filter(team => team.id !== id))
    } else {
      setSnackbarMessage('Unable to delete Team')
      setSeverity('error')
      setSnackbarOpen(true)
      setLoading(false)
    }
  }

  const handleAddMember = () => {
    if (isEditing) {
      setSnackbarMessage('Please save Team Details')
      setSeverity('error')
      setSnackbarOpen(true)
    } else {
      navigate({
        pathname: '/all-groups/group/add-members',
        search: `?name=${teamData.name}&id=${teamData.id}&organization_id=${user.small_decision.organization_id}`
      })
    }
  }

  return (
    <div>
      <div>
        {isEditing ? (
          <Input
            value={teamName}
            onChange={e => setTeamName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                teamName && editTeamName(teamName)
              }
            }}
          />
        ) : (
          <Typography style={{ fontSize: 24, fontWeight: 700, lineHeight: '140%' }}>
            {teamName}
          </Typography>
        )}

        {loading ? (
          <div>
            <Progress />
          </div>
        ) : (
          <div>
            {isEditing ? (
              <div onClick={() => teamName && editTeamName(teamName)}>
                <img src='/images/pages/teams/icon-save.svg' alt='save' width={20} height={20} />
              </div>
            ) : (
              <div onClick={() => setIsEditing(true)}>
                <img src='/images/pages/teams/pen-icon.svg' alt='pen' width={20} height={20} />
              </div>
            )}

            <div onClick={() => removeTeam(teamData.id!)}>
              <img src='/images/pages/teams/trash-icon.svg' alt='trash' width={20} height={20} />
            </div>
          </div>
        )}
      </div>
      <div>
        <div>
          <Typography style={{ fontSize: 20, fontWeight: 700, lineHeight: '140%' }}>
            Members
          </Typography>
          <Typography style={{ fontSize: 16, fontWeight: 400, lineHeight: '150%' }}>
            {teamData.numberOfParticipants === 0
              ? 'This team currently has [no members]!'
              : `This team currently has [${teamData.numberOfParticipants} members]!`}
          </Typography>
        </div>
        <div onClick={handleAddMember}>Add Members</div>
        {/* <Link href={isEditing ? '#' : '/all-teams/team/add-members'}>
          <WhiteBtnCard>Add Members</WhiteBtnCard>
        </Link> */}
      </div>
    </div>
  )
}

export default TeamCard
