import React, { FC, useEffect, useState } from 'react'
import { Search, Add } from '@mui/icons-material'
import { getOrganizationMembers, postMemberPrediction } from 'src/api/decision-hub'
import { Grid, Typography, TextField, InputAdornment, IconButton, Checkbox, Chip, Box, Tooltip } from '@mui/material'
import { DecisionCrowdList, SelectedItems } from '../../style/style-decision-hub-select-crowd'

type PredictionMember = {
  id: number
  name: string
  email: string
}

type OrganizationMember = {
  user: string
  username: string
}

const SelectDecisionPeople: FC<any> = ({ selectedMembers, setSelectedMembers, user }) => {
  const orgId = Number(user.small_decision.organization_id)
  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [memberSearchQuery, setMemberSearchQuery] = useState('')
  const [predictionMembers, setPredictionMembers] = useState<PredictionMember[]>([])

  useEffect(() => {
    const storedSelectedMembers = sessionStorage.getItem('selectedMembers')
    if (storedSelectedMembers) {
      setSelectedMembers(JSON.parse(storedSelectedMembers))
    }
  }, [setSelectedMembers])

  useEffect(() => {
    const fetchData = async () => {
      const selectedUserIds = selectedMembers.map(member => ({ userId: member.user }))
      const params = {
        categoryId: 3,
        organizationId: orgId,
        postCrowdParticipants: selectedUserIds
      }

      const response = await postMemberPrediction(params)
      setPredictionMembers(response)
    }

    fetchData()
  }, [selectedMembers, orgId])

  useEffect(() => {
    sessionStorage.setItem('selectedMembers', JSON.stringify(selectedMembers))
  }, [selectedMembers])

  const handleOrgMember = async () => {
    const response = await getOrganizationMembers(orgId)
    setMembers(response)
  }

  useEffect(() => {
    handleOrgMember()
  }, [])

  const filteredMembers = members.filter(member =>
    member.username.toLowerCase().includes(memberSearchQuery.toLowerCase())
  )

  const isMemberSelected = (member: OrganizationMember) =>
    selectedMembers.some(selected => selected.user === member.user)

  const handleMemberCheckbox = (member: OrganizationMember) => {
    setSelectedMembers(prevSelectedMembers => {
      const isSelected = isMemberSelected(member)

      if (isSelected) {
        return prevSelectedMembers.filter(m => m.user !== member.user)
      } else {
        return [...prevSelectedMembers, member]
      }
    })
  }

  const handleAddPredictionMember = (predictionMember: PredictionMember) => {
    setSelectedMembers(prevSelectedMembers => [
      ...prevSelectedMembers,
      {
        user: Number(predictionMember.id),
        username: predictionMember.name
      }
    ])
  }

  return (
    <Grid md={6} xs={12} sm={6}>
      <Typography variant='h5'>People</Typography>

      <Typography variant='h6'>Search people</Typography>
      <TextField
        type='text'
        placeholder='Search'
        style={{ marginRight: '8px' }}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton edge='end' aria-label='search'>
                <Search />
              </IconButton>
            </InputAdornment>
          )
        }}
        value={memberSearchQuery}
        onChange={e => setMemberSearchQuery(e.target.value)}
      />
      {predictionMembers.length > 0 && (
        <div>
          <Typography variant='h6'>Wizer Suggestion</Typography>
          <Box display='flex' flexWrap='wrap' gap={1} mt={1}>
            {predictionMembers.map(predictionMember => {
              const isAlreadySelected = selectedMembers.some(member => member.user === Number(predictionMember.id))
              if (isAlreadySelected) {
                return null
              }

              return (
                <Tooltip key={predictionMember.id} title={predictionMember.email} placement='top'>
                  <Chip
                    key={predictionMember.id}
                    label={predictionMember.name}
                    // color='secondary'
                    onDelete={() => handleAddPredictionMember(predictionMember)}
                    deleteIcon={<Add style={{ color: 'white', background: 'gray', borderRadius: 100 }} />}
                  />
                </Tooltip>
              )
            })}
          </Box>
        </div>
      )}
      <DecisionCrowdList>
        {memberSearchQuery !== '' ? (
          filteredMembers.length === 0 ? (
            <Typography variant='body1'>No data found</Typography>
          ) : (
            filteredMembers.map(member => (
              <div key={member.user}>
                <Checkbox checked={isMemberSelected(member)} onChange={() => handleMemberCheckbox(member)} />
                {member.username}
              </div>
            ))
          )
        ) : null}

        {selectedMembers.length > 0 && (
          <SelectedItems>
            <Typography variant='h5'>Selected Members</Typography>
            <Box>
              {selectedMembers.map(member => (
                <Tooltip
                  key={member.user}
                  title={
                    member?.teamDetails === null
                      ? 'No Team'
                      : member?.teamDetails?.length === 1
                      ? member.teamDetails[0].teamName
                      : member.teamDetails?.map(team => team.teamName).join(', ')
                  }
                  placement='bottom'
                >
                  <Chip
                    key={member.user}
                    label={member.username}
                    color='primary'
                    onDelete={() =>
                      setSelectedMembers(prevSelectedMembers => prevSelectedMembers.filter(m => m !== member))
                    }
                  />
                </Tooltip>
              ))}
            </Box>
          </SelectedItems>
        )}
      </DecisionCrowdList>
    </Grid>
  )
}

export default SelectDecisionPeople
