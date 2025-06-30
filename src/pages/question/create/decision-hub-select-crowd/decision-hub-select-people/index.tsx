import { useEffect, useState, type FC } from 'react'
import { getOrganizationMembers, postMemberPrediction } from '@/apis/decision-hub'
import { Button } from '@/components/components/ui/button'
import { Typography } from '@/components/components/ui/typography'
import { Input } from '@/components/components/ui/input'

type OrganizationMember = {
    user: string
    username: string
    teamDetails: any
}

const DecisionHubSelectPeople: FC<any> = ({ selectedMembers, setSelectedMembers, user }) => {
    const orgId = Number(user.small_decision.organization_id)
    const [members, setMembers] = useState<OrganizationMember[]>([])
    const [memberSearchQuery, setMemberSearchQuery] = useState('')

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
                <Input
                    type="text"
                    placeholder="Search people..."
                    className="w-full border-b border-gray-300 rounded-none px-0 py-1 text-base border-t-0 border-x-0 border-b-primary focus-visible:ring-0 focus:border-primary"
                    value={memberSearchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMemberSearchQuery(e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-2">
                {filteredMembers.length === 0 ? (
                    null
                ) : (
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
                )}
            </div>
        </div>
    )
}

export default DecisionHubSelectPeople
