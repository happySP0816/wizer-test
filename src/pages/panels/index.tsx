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
    <div>
      <div>
        <div>
          <Typography variant="h5">All Panels ({crowds.length})</Typography>
          <Button onClick={() => setIsAddCrowd(true)}>Add new panel</Button>
        </div>
        {loading ? (
          <Progress value={50}>
            <ProgressIndicator />
          </Progress>
        ) : (
          <div>
            {isAddCrowd && (
              <div>
                <div>
                  <div>
                    Create a new panel
                  </div>
                  <div>
                    <div>
                      Panel title
                    </div>
                    <Input
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
                    />
                  </div>
                  <div>
                    <Button onClick={() => setIsAddCrowd(false)}>Cancel</Button>
                    {loadingCreate ? (
                      <Progress value={50}>
                        <ProgressIndicator />
                      </Progress>
                    ) : (
                      <Button
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
              </div>
            )}
            {crowds.length > 0 &&
              crowds.map((crowd: CrowdData) => {
                if (!crowd || crowd.id === undefined) return null;
                return (
                  <CrowdCard
                    key={crowd.id}
                    crowdData={crowd}
                    setCrowds={setCrowds}
                    setSnackbarOpen={setSnackbarOpen}
                    setSnackbarMessage={setSnackbarMessage}
                    setSeverity={setSeverity}
                    user={props.user}
                  />
                )
              })}
            {!crowds.length && (
              <div style={{ height: isAddCrowd ? '20vh' : '50vh' }}>
                <div>
                  You have 0 panels
                </div>
                <div>
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
