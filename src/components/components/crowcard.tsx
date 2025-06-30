import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteCrowd, editCrowd } from '@/apis/crowds'
import { Progress } from './ui/progress'


interface CrowdData {
  title: string
  numberOfParticipants?: number
  id?: number
}
interface ICrowdCard {
  crowdData: CrowdData
  setCrowds: React.Dispatch<React.SetStateAction<CrowdData[]>>
  setSnackbarOpen: (open: boolean) => void
  setSnackbarMessage: (message: string) => void
  setSeverity: (severity: string) => void
  user: any
}

const CrowdCard: React.FC<ICrowdCard> = ({
  crowdData,
  setCrowds,
  setSnackbarOpen,
  setSnackbarMessage,
  setSeverity,
  user
}) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)

  const [isEditing, setIsEditing] = useState(false)
  const [crowdTitle, setCrowdTitle] = useState(crowdData.title)

  // // console.log("crowd card props: ", user)
  const editCrowdTitle = async (title: string) => {
    setLoading(true)
    const res = await editCrowd(title, crowdData.id as number)

    if (res.DecsionHubcrowd.id) {
      setSnackbarMessage('Panel Title Edited')
      setSeverity('success')
      setSnackbarOpen(true)
      setIsEditing(false)
    } else {
      setSnackbarMessage('Unable to edit Panel Title')
      setSeverity('error')
      setSnackbarOpen(true)
    }
    setLoading(false)
  }

  const removeCrowd = async (id: number) => {
    setLoading(true)
    const res = await deleteCrowd(id)
    if (res.result === true) {
      setSnackbarMessage('Panel Deleted')
      setSeverity('success')
      setSnackbarOpen(true)
      setLoading(false)
      setCrowds(crowds => crowds.filter((crowd: CrowdData) => crowd.id !== id))
    } else {
      setSnackbarMessage('Unable to delete Panel')
      setSeverity('error')
      setSnackbarOpen(true)
      setLoading(false)
    }
  }

  const handleAddMember = () => {
    if (isEditing) {
      setSnackbarMessage('Please save Panel Details')
      setSeverity('error')
      setSnackbarOpen(true)
    } else {
      navigate('/all-panels/panel/add-members', {
        state: { title: crowdData.title, id: crowdData.id, organization_id: user?.small_decision?.organization_id }
      })
    }
  }

  return (
    <div>
      <div>
        {isEditing ? (
          <input
            value={crowdTitle}
            onChange={e => setCrowdTitle(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                crowdTitle && editCrowdTitle(crowdTitle)
              }
            }}
          />
        ) : (
          <div>
            {crowdTitle}
          </div>
        )}

        {loading ? (
          <div>
            <Progress />
          </div>
        ) : (
          <div>
            {isEditing ? (
              <div onClick={() => crowdTitle && editCrowdTitle(crowdTitle)}>
                <img src='/images/pages/crowds/icon-save.svg' alt='save' width={15} height={15} />
              </div>
            ) : (
              <div onClick={() => setIsEditing(true)}>
                <img src='/images/pages/crowds/pen-icon.svg' alt='pen' width={15} height={15} />
              </div>
            )}

            <div onClick={() => crowdData.id !== undefined && removeCrowd(crowdData.id)}>
              <img src='/images/pages/crowds/trash-icon.svg' alt='trash' width={15} height={15} />
            </div>
          </div>
        )}
      </div>
      <div>
        
      </div>
      <div>
        <div>
          <div>
            Members
          </div>
          <div>
            {crowdData.numberOfParticipants === 0
              ? 'This panel currently has [no members]!'
              : `This panel currently has [${crowdData.numberOfParticipants} members]!`}
          </div>
        </div>
        <div onClick={handleAddMember}>
          Add Members
        </div>
        {/* <Link href={isEditing ? '#' : '/all-crowds/crowd/add-members'}>
          <WhiteBtnCard>Add Members</WhiteBtnCard>
        </Link> */}
      </div>
    </div>
  )
}

export default CrowdCard
