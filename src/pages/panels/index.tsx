import React, { useEffect, useState } from 'react'
import { addCrowd, getCrowds } from '@/apis/crowds'
import { Button } from '@/components/components/ui/button'
import { Progress } from '@/components/components/ui/progress'
import { ProgressIndicator } from '@radix-ui/react-progress'
import { Input } from '@/components/components/ui/input'
import { toast } from 'sonner'
import { Typography } from '@/components/components/ui/typography'
import CrowdCard from '@/components/components/crowcard'
import authRoute from '@/authentication/authRoute'

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
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingCreate, setLoadingCreate] = useState<boolean>(false)
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
  const [snackbarMessage, setSnackbarMessage] = useState<string>('')
  const [severity, setSeverity] = useState<string>('success')

  const [isAddCrowd, setIsAddCrowd] = useState<boolean>(false)
  const [crowdCardData, setCrowdCardData] = useState<CrowdData>({ title: '' })
  const [crowds, setCrowds] = useState<CrowdData[]>([])

  const orgId = props.user.small_decision.organization_id

  const fetchCrowds = async () => {
    setLoading(true);
    try {
      const res = await getCrowds();
      
      if (Array.isArray(res)) { // Ensure it's an array before checking length
        setCrowds(res);
      } else {
        setSnackbarMessage('Unable to fetch Panels Data');
        setSeverity('error');
        setSnackbarOpen(true);
        toast.error('Unable to fetch Panels Data');
      }
    } catch (error) {
      setSnackbarMessage('Error fetching Panels Data');
      setSeverity('error');
      setSnackbarOpen(true);
      toast.error('Error fetching Panels Data');
    } finally {
      setLoading(false);
    }
  };
  
  const createCrowd = async (title: string) => {
    setLoadingCreate(true)
    const res = await addCrowd(title, orgId.toString())
    console.log("Sdsds", res)
    if (res && res.DecsionHubcrowd && res.DecsionHubcrowd.id) {
      fetchCrowds()
      setSnackbarMessage('Panel Creation Successful')
      setSeverity('success')
      setSnackbarOpen(true)
      toast.success('Panel Creation Successful');
    } else {
      setSnackbarMessage('Unable to create Panel')
      setSeverity('error')
      setSnackbarOpen(true)
      toast.error('Unable to create Panel');
    }

    setIsAddCrowd(false)
    setCrowdCardData({ title: '' })
    setLoadingCreate(false)
  }

  useEffect(() => {
    fetchCrowds()
  }, [])
  
  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen rounded-b-xl shadow">
      <div className="bg-purple-500 rounded-t-xl px-8 py-6 flex items-center justify-between">
        <h1 className="text-white text-2xl font-semibold">All Panels ({crowds.length})</h1>
        <Button variant="outline" className="border-purple-400 text-purple-500 hover:bg-purple-50" onClick={() => setIsAddCrowd(true)}>
          Add new panel
        </Button>
      </div>
      <div className="p-6">
        {loading ? (
          <div>
            <Progress />
          </div>
        ) : (
          <div>
            {isAddCrowd && (
              <div className="border-2 border-purple-400 rounded-lg p-6 my-6">
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
                    className="border border-purple-400 rounded px-3 py-2 w-full"
                  />
                </div>
                <div className="flex gap-4 justify-end">
                  <Button variant="outline" className="border-purple-400 text-purple-500 hover:bg-purple-50" onClick={() => setIsAddCrowd(false)}>Cancel</Button>
                  {loadingCreate ? (
                    <Progress />
                  ) : (
                    <Button
                      variant="outline"
                      className="border-purple-400 text-purple-500 hover:bg-purple-50"
                      onClick={() => {
                        if (crowdCardData.title) {
                          createCrowd(crowdCardData.title)
                        }
                      }}
                    >
                      Create panel
                    </Button>
                  )}
                </div>
              </div>
            )}
            {crowds.length > 0 &&
              crowds.map((crowd: CrowdData) => {
                if (!crowd || crowd.id === undefined) return null;
                return (
                  <div key={crowd.id} className="border-2 border-purple-400 rounded-lg p-6 my-6">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-semibold text-gray-800">{crowd.title}</h2>
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
                          {crowd.numberOfParticipants === 0
                            ? 'This panel currently has [no members]!'
                            : `This panel currently has [${crowd.numberOfParticipants} members]!`}
                        </div>
                      </div>
                      <Button variant="outline" className="border-purple-400 text-purple-500 hover:bg-purple-50">
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
