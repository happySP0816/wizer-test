import React, { FC, useEffect, useState } from 'react'
import { Search, Add } from '@mui/icons-material'
import { getOrganizationMembers, postMemberPrediction } from 'src/api/decision-hub'
import { Grid, Typography, TextField, InputAdornment, IconButton, Checkbox, Chip, Box, Tooltip, Button } from '@mui/material'
import { DecisionCrowdList, SelectedItems } from '../../style/style-decision-hub-select-crowd'
import { Search as SearchIcon } from "@mui/icons-material"
import input from './../../../../@core/theme/overrides/input';

type PredictionMember = {
  id: number
  name: string
  email: string
}

type OrganizationMember = {
  user: string
  username: string
  teamDetails: any
}

const SelectDecisionPeopleNew: FC<any> = ({ selectedMembers, setSelectedMembers, user }) => {
  const orgId = Number(user.small_decision.organization_id)
  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [memberSearchQuery, setMemberSearchQuery] = useState('')
  const [predictionMembers, setPredictionMembers] = useState<PredictionMember[]>([])

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

  const handleOrgMember = async () => {
    const response = await getOrganizationMembers(orgId)
    setMembers(response)
  }

  useEffect(() => {
    handleOrgMember()
  }, [])

  const filteredMembers = memberSearchQuery !== '' ?
      members.filter(member =>
        member.username.toLowerCase().includes(memberSearchQuery.toLowerCase())
      ) : members

  const isMemberSelected = (member: OrganizationMember) =>
    selectedMembers.some(selected => selected.user === member.user)

  const handleAddPanel = (member: OrganizationMember) => {
    setSelectedMembers(prevSelectedMembers => {
        return [...prevSelectedMembers, member]
    })
  }

  const handleRemovePanel = (member: OrganizationMember) => {
    setSelectedMembers(prevSelectedMembers => {
        return prevSelectedMembers.filter(m => m.user !== member.user)
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
    <Grid md={12} xs={12} sm={12}>
      {selectedMembers.length > 0 && (
        <div>
          <Box display='flex' flexWrap='wrap' gap={1} mt={1}>
            {selectedMembers.map((panel, index) => {
              return (
                <Box key={index} width={'100%'} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="body1">{panel.username}</Typography>
                  <Box display='flex' gap={4} alignItems='center'>
                   {/* <Box
                    sx={{
                      display: 'inline-block',
                      border: '2px solid rgb(22, 22, 22)',
                      px: 1,
                      borderRadius: '4px',
                      fontSize: "0.7rem"
                    }}
                  >
                    {panel.teamDetails[0].teamName}
                  </Box> */}
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        height: "24px",
                        minWidth: "60px",
                        fontSize: "0.7rem",
                        borderRadius: "4px",
                        color: "#9575cd",
                        borderColor: "#9575cd",
                        "&:hover": {
                          borderColor: "#7e57c2",
                          backgroundColor: "rgba(149, 117, 205, 0.04)",
                        },
                        textTransform: "none",
                      }}
                      onClick={() => handleRemovePanel(panel)}
                    >
                      REMOVE
                    </Button>
                    </Box>
                </Box>
              )
            })}
          </Box>
          
        </div>
      )}

      <TextField
        fullWidth
        type='text'
        placeholder="Search people..."
        variant="standard"
        size="small"
        InputProps={{
          disableUnderline: false,
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          )
        }}
        sx={{
          '& .MuiInputBase-root': {
            borderRadius: 0,
            borderBottom: '1px solid #ccc',
            paddingLeft: 0,
            paddingRight: 0,
            fontSize: '16px',
          },
          '& input': {
            padding: '6px 0 6px 0',
          },
        }}
        value={memberSearchQuery}
        onChange={e => setMemberSearchQuery(e.target.value)}
      />

      <DecisionCrowdList>
        {filteredMembers.length === 0 ? (
            null
          ) : (
            filteredMembers.map((panel, index) => {
              console.log(panel)
              return !isMemberSelected(panel) ? (
                <Box key={index} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="body1">{panel.username}</Typography>
                  <Box display='flex' gap={4} alignItems='center'>
                    {/* <Box
                      sx={{
                        display: 'inline-block',
                        border: '2px solid rgb(22, 22, 22)',
                        px: 1,
                        borderRadius: '4px',
                        fontSize: "0.7rem"
                      }}
                    >
                      {panel.teamDetails[0].teamName}
                    </Box> */}
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        height: "24px",
                        minWidth: "50px",
                        fontSize: "0.7rem",
                        borderRadius: "4px",
                        backgroundColor: "#9575cd",
                        "&:hover": {
                          backgroundColor: "#7e57c2",
                        },
                        textTransform: "none",
                      }}
                      onClick={() => handleAddPanel(panel)}
                    >
                      ADD
                    </Button>
                  </Box>
                </Box>
              ) : null
            })
          )}
      </DecisionCrowdList>
    </Grid>
  )
}

export default SelectDecisionPeopleNew
