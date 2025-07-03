import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addCrowd, deleteCrowd, editCrowd, getCrowds } from '@/apis/crowds'
import { Button } from '@/components/components/ui/button'
import LoadingButton from '@/components/components/ui/loading-button'
import { Input } from '@/components/components/ui/input'
import { toast } from 'sonner'
import { Typography } from '@/components/components/ui/typography'
import authRoute from '@/authentication/authRoute'
import { WizerStarIcon } from '@/components/icons'
import Loading from '@/components/loading'

interface PanelsProps {
  userProfile: UserProfileType
  user: MembershipType
}

type UserProfileType = {
  username: string;
  id: number;
}

interface CrowdData {
  title: string
  numberOfParticipants?: number
  id?: number
}

type MembershipType = {
  organization_id: number
  member_role: string
  small_decision: {
    organization_id: number
    member_role: string
  }
}
const AllCrowds: React.FC<PanelsProps> = (props) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingCreate, setLoadingCreate] = useState<boolean>(false)
  const [editLoadingMap, setEditLoadingMap] = useState<Map<number, boolean>>(new Map())
  const [deleteLoadingMap, setDeleteLoadingMap] = useState<Map<number, boolean>>(new Map())

  const [isAddCrowd, setIsAddCrowd] = useState<boolean>(false)
  const [crowdCardData, setCrowdCardData] = useState<CrowdData>({ title: '' })
  const [crowds, setCrowds] = useState<CrowdData[]>([])
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [crowdTitle, setCrowdTitle] = useState<string>('')
  const [editingCrowdId, setEditingCrowdId] = useState<number | null>(null)

  const orgId = props.user.small_decision.organization_id

  // Helper functions to manage loading states
  const setEditLoading = (id: number, loading: boolean) => {
    setEditLoadingMap(prev => new Map(prev.set(id, loading)))
  }

  const setDeleteLoading = (id: number, loading: boolean) => {
    setDeleteLoadingMap(prev => new Map(prev.set(id, loading)))
  }

  const getEditLoading = (id: number) => editLoadingMap.get(id) || false
  const getDeleteLoading = (id: number) => deleteLoadingMap.get(id) || false

  const fetchCrowds = async () => {
    setLoading(true);
    try {
      const res = await getCrowds();

      if (Array.isArray(res)) { // Ensure it's an array before checking length
        setCrowds(res);
      } else {
        toast.error('Unable to fetch Panels Data');
      }
    } catch (error) {
      toast.error('Error fetching Panels Data');
    } finally {
      setLoading(false);
    }
  };

  const createCrowd = async (title: string) => {
    setLoadingCreate(true)
    const res = await addCrowd(title, orgId.toString())
    if (res && res.DecsionHubcrowd && res.DecsionHubcrowd.id) {
      setCrowds(prevCrowds => [...prevCrowds, { title: title, id: res.DecsionHubcrowd.id }])
      toast.success('Panel Creation Successful');
    } else {
      toast.error('Unable to create Panel');
    }

    setIsAddCrowd(false)
    setCrowdCardData({ title: '' })
    setLoadingCreate(false)
  }

  useEffect(() => {
    fetchCrowds()
  }, [])


  const editCrowdTitle = async (title: string, id: number) => {
    setEditLoading(id, true)
    const res = await editCrowd(title, id)

    if (res.DecsionHubcrowd.id) {
      setIsEditing(false)
      setEditingCrowdId(null)
      setCrowdTitle('')
      setCrowds(prevCrowds => prevCrowds.map(crowd => crowd.id === id ? { ...crowd, title } : crowd))
      // fetchCrowds()
    } else {
      toast.error('Unable to edit Panel Title')
    }
    setEditLoading(id, false)
  }

  const removeCrowd = async (id: number) => {
    setDeleteLoading(id, true)
    const res = await deleteCrowd(id)
    if (res.result === true) {
      setDeleteLoading(id, false)
      setCrowds(crowds => crowds.filter((crowd: CrowdData) => crowd.id !== id))
    } else {
      toast.error('Unable to delete Panel')
      setDeleteLoading(id, false)
    }
  }

  const handleAddMember = (crowdData: CrowdData) => {
    if (isEditing) {
      toast.error('Please save Panel Details')
    } else {
      navigate(`/panels/add-members?title=${crowdData.title}&id=${crowdData.id}&organization_id=${props.user.small_decision.organization_id}`)
    }
  }

  return (
    <div className="!h-screen p-[30px] flex flex-col gap-8">
      <div className="flex items-center justify-between flex-none">
        <div className='flex items-center justify-center'>
          <div className='mr-3 text-primary'>
            <WizerStarIcon size={32} style={{ width: '32px', height: '32px' }} />
          </div>
          <Typography className="flex items-center text-4xl font-bold">
            All Panels ({crowds.length})
          </Typography>
        </div>
        <div className="flex gap-2">
          <Button className='rounded-4xl' onClick={() => setIsAddCrowd(true)}>
            Add new panel
          </Button>
        </div>
      </div>
      <div className="p-6">
        {loading ? (
          <Loading />
        ) : (
          <div>
            {isAddCrowd && (
              <div className="border-2 border-gray-300 rounded-lg p-6 my-6">
                <div className="mb-4 text-lg font-semibold text-gray-800">Create a new panel</div>
                <div className="mb-4">
                  <label className="block font-medium mb-1">Panel name</label>
                  <input
                    type='text'
                    onChange={e =>
                      setCrowdCardData(cardData => {
                        return {
                          ...cardData,
                          title: e.target.value
                        }
                      })
                    }
                    value={crowdCardData.title}
                    name='title'
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                </div>
                <div className="flex gap-4 justify-end">
                  <Button variant="outline" className='border border-primary hover:!border-primary' onClick={() => setIsAddCrowd(false)}>Cancel</Button>
                  <LoadingButton
                    loading={loadingCreate}
                    loadingText="Creating..."
                    variant="default"
                    onClick={() => {
                      if (crowdCardData.title) {
                        createCrowd(crowdCardData.title)
                      }
                    }}
                  >
                    Create panel
                  </LoadingButton>
                </div>
              </div>
            )}
            {crowds.length > 0 &&
              crowds.map((crowd: CrowdData) => {
                if (!crowd || crowd.id === undefined) return null;
                return (
                  <div key={crowd.id} className="border-2 border-primary rounded-lg p-6 my-6">
                    <div className="flex justify-between items-start gap-1.5">
                      {isEditing && editingCrowdId === crowd.id ? (
                        <Input
                          value={crowdTitle}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCrowdTitle(e.target.value)}
                          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            if (e.key === 'Enter' && crowd.id) {
                              crowdTitle && editCrowdTitle(crowdTitle, crowd.id)
                            }
                          }}
                        />
                      ) : (
                        <Typography variant="h4" className="text-xl font-semibold text-gray-800">
                          {crowd.title}
                        </Typography>
                      )}
                      <div className="flex gap-2">
                        {isEditing && editingCrowdId === crowd.id ? (
                          <LoadingButton
                            loading={getEditLoading(crowd.id as number)}
                            onClick={() => crowdTitle && crowd.id && editCrowdTitle(crowdTitle, crowd.id)}
                            variant="outline" size="icon" className="border-primary">
                            <img src='/images/pages/crowds/icon-save.svg' alt='save' width={15} height={15} />
                          </LoadingButton>
                        ) : (
                          <Button onClick={() => {
                            setIsEditing(true)
                            setEditingCrowdId(crowd.id || null)
                            setCrowdTitle(crowd.title)
                          }} variant="outline" size="icon" className="border-primary">
                            <img src='/images/pages/crowds/pen-icon.svg' alt='pen' width={15} height={15} />
                          </Button>
                        )}
                        <LoadingButton
                          loading={getDeleteLoading(crowd.id as number)}
                          onClick={() => removeCrowd(crowd.id as number)}
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
                          {crowd.numberOfParticipants === 0
                            ? 'This panel currently has [no members]!'
                            : `This panel currently has [${crowd.numberOfParticipants} members]!`}
                        </div>
                      </div>
                      <Button variant="outline" className="border-primary" onClick={() => handleAddMember(crowd)}>
                        Add Members
                      </Button>
                    </div>
                  </div>
                )
              })}
            {!crowds.length && (
              <div style={{ height: isAddCrowd ? '20vh' : '50vh' }} className="flex flex-col items-center justify-center">
                <div className="text-lg font-semibold text-gray-700 mb-2">
                  You have 0 panels
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

export default authRoute(AllCrowds)
