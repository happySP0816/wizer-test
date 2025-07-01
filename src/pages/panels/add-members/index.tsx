import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/components/ui/button'
import { Input } from '@/components/components/ui/input'
import { Typography } from '@/components/components/ui/typography'
import { Card } from '@/components/components/ui/card'
import { toast } from 'sonner'
import { Search, UserPlus, Loader2, Star, Trash2 } from 'lucide-react'
import {
    getCrowdParticipants,
    getOrganizationMembersForCrowd,
    addCrowdParticipants,
    deleteCrowdParticipant
} from '@/apis/crowds'
import authRoute from '@/authentication/authRoute'
import LoadingButton from '@/components/components/ui/loading-button'

interface MembershipType {
    organization_id: number
    member_role: string
}

type UserProfileType = {
    username: string;
    id: number;
}

interface IMember {
    id: number
    name: string
    email: string
    selected?: boolean
    isCrowdLead?: boolean
}

const AddMembersPanel: React.FC<{user: MembershipType, userProfile: UserProfileType}> = (props) => {
    const [searchParams] = useSearchParams()
    const [crowdTitle, setCrowdTitle] = useState<string>('')
    const [crowdId, setCrowdId] = useState<string>('')
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [members, setMembers] = useState<IMember[]>([])
    const [selectedMembers, setSelectedMembers] = useState<IMember[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null)

    const searchedMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    const orgId = searchParams.get('organization_id')

    useEffect(() => {
        setCrowdTitle(searchParams.get('title') || '')
        setCrowdId(searchParams.get('id') || '')
        fetchAllMembers(searchParams.get('id') || '')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchAllMembers = async (crowdId: string) => {
        setLoading(true)
        const res = await getOrganizationMembersForCrowd(Number(orgId))
        if (res && res.length > 0) {
            const modifiedMembers = modifyMembers(res)
            await fetchCrowdParticipants(modifiedMembers, crowdId)
        } else {
            toast.error('Unable to Fetch all Members')
        }
        setLoading(false)
    }

    const modifyMembers = (members: any[]): IMember[] => {
        return members.map(member => ({
            id: member.user,
            name: member.name || member.username,
            email: member.email,
            selected: false,
            isCrowdLead: false
        }))
    }

    const modifyParticipants = (participantsArr: any[]) => {
        const newArr = participantsArr.map(member => {
            return {
                ...member.user,
                name: member.user.username,
                selected: true,
                isCrowdLead: false
            }
        })

        return newArr
    }

    const filterMembers = (allMembers: IMember[], participants: IMember[]): IMember[] => {
        const participantIds = participants.map(p => p.id)
        return allMembers.filter(member => !participantIds.includes(member.id))
    }

    const fetchCrowdParticipants = async (modifiedMembers: IMember[], crowdId: string) => {
        const res = await getCrowdParticipants(Number(crowdId))
        if (res && res.length > 0) {
            const modifiedParticipants = modifyParticipants(res)
            setSelectedMembers(modifiedParticipants)
            const filteredAllMembers = filterMembers(modifiedMembers, modifiedParticipants)

            if (filteredAllMembers.length > 0) {
                setMembers(filteredAllMembers)
            } else {
                setMembers(modifiedMembers)
            }
        } else {
            setMembers(modifiedMembers)
        }
    }

    useEffect(() => {
        const title = searchParams.get('title')
        const id = searchParams.get('id')

        if (title && id) {
            setCrowdTitle(title)
            setCrowdId(id)
            fetchAllMembers(id)
        }
    }, [searchParams])

    const handleChangeSelected = (id: number) => {
        setMembers(members =>
            members.map(member =>
                member.id * 1 === id * 1 ? { ...member, selected: !member.selected } : member
            )
        )
    }

    const handleAddSelected = async () => {
        setSearchQuery('')
        const newSelectedMembers = members.filter(member => member.selected === true)
        setSelectedMembers(prevSelectedMembers => [...prevSelectedMembers, ...newSelectedMembers])

        const participants = newSelectedMembers.map(member => Number(member.id))
        try {
            const res = await addCrowdParticipants(Number(crowdId), participants)

            if (res && res.crowdParticipant && res.crowdParticipant.length > 0) {
                fetchAllMembers(crowdId)
                toast.success('Member Added')
            } else {
                toast.error('Unable to Add Panel Member')
            }
        } catch (error) {
            toast.error('Error adding member')
        }
    }

    const removeSelectedMember = async (id: number) => {
        setDeleteLoading(id)
        const memberToRemove = selectedMembers.find(selectedMember => selectedMember.id === id)
        if (memberToRemove) {
            setMembers([...members, { ...memberToRemove, selected: false, isCrowdLead: false }])
        }

        try {
            const res = await deleteCrowdParticipant(id, Number(crowdId))
            if (res.result) {
                setSelectedMembers(selectedMembers =>
                    selectedMembers.filter(selectedMember => selectedMember.id !== id)
                )
                toast.success('Member Deleted')
            } else {
                toast.error('Unable to Delete Panel Member')
            }
        } catch (error) {
            toast.error('Error deleting member')
        } finally {
            setDeleteLoading(null)
        }
    }

    const MemberInList: React.FC<{ member: IMember }> = ({
        member,
    }) => (
        <div className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0" onClick={() => {
            if (selectedMembers.some(m => m.id === member.id) || member.id === props.userProfile.id) {
                return
            }
            handleChangeSelected(member.id)
        }}>
            <input
                type="checkbox"
                checked={member.selected}
                disabled={selectedMembers.some(m => m.id === member.id) || member.id === props.userProfile.id}
                onChange={() => handleChangeSelected(member.id)}
                className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
            />
            <Typography variant="body1" className="text-base font-normal leading-6">
                {member.name}
            </Typography>
        </div>
    )

    const MemberCard: React.FC<{ member: IMember; removeSelectedMember: (id: number) => void }> = ({
        member,
        removeSelectedMember
    }) => (
        <Card className="border border-gray-200 p-4 rounded-xs">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    {member.isCrowdLead && (
                        <Star className="w-6 h-6 text-yellow-500 fill-current" />
                    )}
                    <Typography variant="h3" className="text-2xl font-bold text-gray-800">
                        {member.name}
                    </Typography>
                </div>
                <div className="flex items-center gap-3">
                    <LoadingButton
                        loading={deleteLoading === member.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSelectedMember(member.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <Trash2 className="w-5 h-5" />
                    </LoadingButton>
                </div>
            </div>
        </Card>
    )

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto p-6">
                <div className="mb-8">
                    <Typography variant="h2" className="font-bold text-foreground">
                        {crowdTitle ? crowdTitle : ''} Panel
                    </Typography>
                </div>
                <div className="mb-8">
                    <Typography variant="body1" className="text-sm font-semibold mb-2">
                        Search for people
                    </Typography>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Start searching..."
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setSearchQuery(e.target.value)
                                console.log(searchedMembers)
                            }}
                            value={searchQuery}
                            className={`pr-10 ${searchQuery && searchedMembers.length ? 'rounded-b-none' : ''}`}
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        {searchQuery && searchedMembers.length > 0 && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-md shadow-lg z-10 overflow-y-auto">
                                {searchedMembers.map(member => (
                                    <MemberInList key={member.id} member={member}/>
                                ))}
                                <div className="p-3 border-t">
                                    <Button
                                        onClick={handleAddSelected}
                                        className="w-full"
                                        disabled={!members.some(m => m.selected)}
                                    >
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Add selected to panel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {loading ? (
                    <div className="flex items-center justify-center p-8">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <Typography variant="body2" className="text-muted-foreground">
                                Loading members...
                            </Typography>
                        </div>
                    </div>
                ) : (
                    <div>
                        <Typography variant="h3" className="text-2xl font-bold mb-6">
                            All Members ({selectedMembers.length})
                        </Typography>
                        {selectedMembers.length > 0 ? (
                            <div className="space-y-4">
                                {selectedMembers.map(member => (
                                    <MemberCard key={member.id} member={member} removeSelectedMember={removeSelectedMember} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="max-w-md mx-auto space-y-4">
                                    <Typography variant="body1" className="text-lg text-muted-foreground">
                                        {crowdTitle ? crowdTitle : ''} Panel has no members.
                                    </Typography>
                                    <Typography variant="body2" className="text-muted-foreground">
                                        Use the search bar above to find people for your panel!
                                    </Typography>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default authRoute(AddMembersPanel)