import { useEffect, useState, type FC } from 'react'
import { getOrganizationMembers } from '@/apis/decision-hub'
import { Button } from '@/components/components/ui/button'
import { Typography } from '@/components/components/ui/typography'
import { Input } from '@/components/components/ui/input'
import { Search, Loader2 } from 'lucide-react'

type OrganizationMember = {
    user: string
    username: string
    teamDetails: any
}

const DecisionHubSelectPeople: FC<any> = ({ selectedMembers, setSelectedMembers, user }) => {
    const orgId = Number(user.small_decision.organization_id)
    const [members, setMembers] = useState<OrganizationMember[]>([])
    const [memberSearchQuery, setMemberSearchQuery] = useState('')
    const [isLoadingMembers, setIsLoadingMembers] = useState(false)

    const handleOrgMember = async () => {
        try {
            setIsLoadingMembers(true)
            const response = await getOrganizationMembers(orgId)
            setMembers(response)
        } catch (error) {
            console.error('Error fetching organization members:', error)
        } finally {
            setIsLoadingMembers(false)
        }
    }

    useEffect(() => {
        handleOrgMember()
    }, [])

    const filteredMembers = memberSearchQuery !== '' ?
        members.filter(member =>
            member.username.toLowerCase().includes(memberSearchQuery.toLowerCase())
        ) : members

    const isMemberSelected = (member: OrganizationMember) =>
        selectedMembers.some((selected: OrganizationMember) => selected.user === member.user)

    const handleAddPanel = (member: OrganizationMember) => {
        setSelectedMembers((prevSelectedMembers: OrganizationMember[]) => {
            return [...prevSelectedMembers, member]
        })
    }

    const handleRemovePanel = (member: OrganizationMember) => {
        setSelectedMembers((prevSelectedMembers: OrganizationMember[]) => {
            return prevSelectedMembers.filter((m: OrganizationMember) => m.user !== member.user)
        })
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <div className='flex justify-end items-center mb-0.5' >
                <Button variant="ghost" size="icon" className="rounded-full p-2">
                    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 12V10H18V12H0ZM0 7V5H18V7H0ZM0 2V0H18V2H0Z" fill="#1D1B20" />
                    </svg>
                </Button>
            </div>
            {selectedMembers.length > 0 && (
                <div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {selectedMembers.map((panel: OrganizationMember, index: number) => {
                            return (
                                <div key={index} className="w-full flex justify-between items-center mb-2">
                                    <Typography variant="body1" className='font-bold text-black'>{panel.username}</Typography>
                                    <div className="flex gap-4 items-center">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-6 min-w-[60px] text-xs rounded text-primary outline-primary border-primary"
                                            onClick={() => handleRemovePanel(panel)}
                                        >
                                            REMOVE
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
            <div className="my-4">
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Search people..."
                        className="w-full border-b border-gray-300 rounded-none px-0 py-1 text-base border-t-0 border-x-0 border-b-primary focus-visible:ring-0 focus:border-primary pr-8"
                        value={memberSearchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMemberSearchQuery(e.target.value)}
                    />
                    {isLoadingMembers ? (
                        <Loader2 className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
                    ) : (
                        <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                {isLoadingMembers ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                        <Typography variant="body2" className="ml-2 text-gray-500">Loading members...</Typography>
                    </div>
                ) : filteredMembers.length > 0 ? (
                    filteredMembers.map((panel: OrganizationMember, index: number) => {
                        return !isMemberSelected(panel) ? (
                            <div key={index} className="flex justify-between items-center mb-2">
                                <Typography variant="body1" className='font-bold text-black'>{panel.username}</Typography>
                                <div className="flex gap-4 items-center">
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="h-6 min-w-[50px] text-xs rounded"
                                        onClick={() => handleAddPanel(panel)}
                                    >
                                        ADD
                                    </Button>
                                </div>
                            </div>
                        ) : null
                    })
                ) : (
                    <div className="flex items-center justify-center py-8">
                        <Typography variant="body2" className="text-gray-500">
                            {memberSearchQuery ? 'No members found' : 'No members available'}
                        </Typography>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DecisionHubSelectPeople
