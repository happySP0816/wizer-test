import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FC } from 'react'
import { getDecisionHubCrowds } from '@/apis/decision-hub'
import { Button } from '@/components/components/ui/button'
import { Typography } from '@/components/components/ui/typography'
import { Input } from '@/components/components/ui/input'
import { addCrowd, addCrowdParticipants, getCrowds, getOrganizationMembersForCrowd } from '@/apis/crowds'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/components/ui/dialog'
import { Plus, Search, Loader2 } from 'lucide-react'

const DecisionHubSelectPanel: FC<any> = ({ selectedCrowds, setSelectedCrowds, user }) => {
    const orgId = Number(user.small_decision.organization_id)
    const [searchString, setSearchString] = useState<string>('')
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [allCrowds, setAllCrowds] = useState<any[]>([])
    const [openCreatePanel, setOpenCreatePanel] = useState(false)
    const [panelName, setPanelName] = useState('')
    const [searchPeopleText, setSearchPeopleText] = useState('')
    const [selectedPeople, setSelectedPeople] = useState<any[]>([])
    const [selectedMembersForCrowd, setSelectedMembersForCrowd] = useState([])

    // Loading states
    const [isLoadingCrowds, setIsLoadingCrowds] = useState(false)
    const [isSearchingCrowds, setIsSearchingCrowds] = useState(false)
    const [isCreatingPanel, setIsCreatingPanel] = useState(false)
    const [isSearchingPeople, setIsSearchingPeople] = useState(false)

    useEffect(() => {
        getAllCrowd()
        getMembersForCrowd()
    }, [])

    const handleSearchInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value
        setSearchString(inputValue)

        if (inputValue.length >= 1) {
            searchDecisionCrowd({ searchString: inputValue })
        } else {
            getAllCrowd()
        }
    }, [])

    const searchDecisionCrowd = async (params: { searchString: string }) => {
        try {
            setIsSearchingCrowds(true)
            const response = await getDecisionHubCrowds(params)
            setSearchResults(response || [])
        } catch (error) {
            console.error('Error searching decision panels:', error)
        } finally {
            setIsSearchingCrowds(false)
        }
    }

    const getAllCrowd = async () => {
        try {
            setIsLoadingCrowds(true)
            const response = await getCrowds()
            setSearchResults(response || [])
            setAllCrowds(response || [])
        } catch (error) {
            console.error('Error searching decision panels:', error)
        } finally {
            setIsLoadingCrowds(false)
        }
    }

    const handleCheckboxChange = (crowdId: number) => {
        setSelectedCrowds((prevSelectedCrowds: number[]) => {
            if (prevSelectedCrowds.includes(crowdId)) {
                return prevSelectedCrowds.filter(id => id !== crowdId)
            } else {
                return [...prevSelectedCrowds, crowdId]
            }
        })
    }

    const handleCreatePanelOpen = () => {
        setOpenCreatePanel(true)
    }

    const handleCreatePanelClose = () => {
        setOpenCreatePanel(false)
        setPanelName('')
        setSearchPeopleText('')
        setSelectedPeople([])
    }

    const handleAddPerson = (person: any) => {
        setSelectedPeople(prev => [...prev, person])
    }

    const handleRemovePerson = (userId: string) => {
        setSelectedPeople(prev => prev.filter(p => p.user !== userId))
    }

    const createPanel = async () => {
        try {
            setIsCreatingPanel(true)
            const createdPanel = await addCrowd(panelName, orgId.toString())
            await addCrowdParticipants(createdPanel.DecsionHubcrowd.id, selectedPeople.map((item) => item.user))
            handleCreatePanelClose()
            getAllCrowd()
        } catch (error) {
            console.error('Error creating panel:', error)
        } finally {
            setIsCreatingPanel(false)
        }
    }

    const getMembersForCrowd = async () => {
        const members = await getOrganizationMembersForCrowd(orgId)
        setSelectedMembersForCrowd(members)
    }

    const filteredPeople = useMemo(() => {
        return selectedMembersForCrowd.filter((person: any) =>
            person.username.toLowerCase().includes(searchPeopleText.toLowerCase())
        );
    }, [searchPeopleText, selectedMembersForCrowd])

    return (
        <div className="w-full max-w-2xl mx-auto p-4 flex flex-col h-full justify-between">
            <div>
                <div className='flex justify-end items-center mb-0.5' >
                    <Button variant="ghost" size="icon" className="rounded-full p-2">
                        <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 12V10H18V12H0ZM0 7V5H18V7H0ZM0 2V0H18V2H0Z" fill="#1D1B20" />
                        </svg>
                    </Button>
                </div>
                {selectedCrowds && selectedCrowds.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {selectedCrowds.map((crowdId: number, index: number) => {
                            const crowd = allCrowds.find((c: any) => c.id === crowdId);
                            if (!crowd) return null;
                            const displayName = crowd.name || crowd.username || crowd.title || crowd.fullName || `Panel #${crowd.id}`;
                            return (
                                <div key={index} className="w-full flex justify-between items-center mb-2">
                                    <Typography variant="body1" className='font-bold text-black'>{displayName}</Typography>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-6 min-w-[60px] text-xs rounded text-primary outline-primary border-primary"
                                        onClick={() => handleCheckboxChange(crowd.id)}
                                    >
                                        REMOVE
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                )}
                <div className="my-4">
                    <div className="relative">
                        <Input
                            type="text"
                            className="w-full border-b border-gray-300 rounded-none px-0 py-1 text-base border-t-0 border-x-0 border-b-primary focus-visible:ring-0 focus:border-primary pr-8"
                            onChange={handleSearchInputChange}
                            value={searchString}
                            placeholder="Search panels..."
                        />
                        {(isSearchingCrowds || isLoadingCrowds) ? (
                            <Loader2 className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
                        ) : (
                            <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    {isLoadingCrowds ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                            <Typography variant="body2" className="ml-2 text-gray-500">Loading panels...</Typography>
                        </div>
                    ) : searchResults.length > 0 ? (
                        searchResults.map((panel: any, index: number) => {
                            if (selectedCrowds.includes(panel.id)) return null;
                            const displayName = panel.name || panel.username || panel.title || panel.fullName || `Panel #${panel.id}`;
                            return (
                                <div key={index} className="flex justify-between items-center mb-2">
                                    <div>
                                        <Typography variant="body1" className='font-bold text-black'>{displayName}</Typography>
                                        {panel.description && (
                                            <Typography variant="caption" className="text-gray-500">{panel.description}</Typography>
                                        )}
                                    </div>
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="h-6 min-w-[50px] text-xs rounded text-white"
                                        onClick={() => handleCheckboxChange(panel.id)}
                                    >
                                        ADD
                                    </Button>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex items-center justify-center py-8">
                            <Typography variant="body2" className="text-gray-500">
                                {searchString ? 'No panels found' : 'No panels available'}
                            </Typography>
                        </div>
                    )}
                </div>
            </div>
            <div>
                <div className="mt-auto flex justify-between items-center">
                    <Typography variant="body2" className="text-gray-600">
                        Not seeing what you want?
                    </Typography>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-black hover:bg-gray-100"
                        onClick={handleCreatePanelOpen}
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Create a Panel
                    </Button>
                </div>
            </div>
            <Dialog open={openCreatePanel} onOpenChange={setOpenCreatePanel}  >
                <DialogContent className="w-[90%] max-w-4xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                            Create a Panel
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Typography variant="body2" className="mb-2 font-medium">Panel Name</Typography>
                            <Input
                                value={panelName}
                                onChange={(e) => setPanelName(e.target.value)}
                                placeholder="Project xyz"
                                className="w-full border-b border-gray-300 rounded-none px-0 py-1 text-base border-t-0 border-x-0 border-b-primary focus-visible:ring-0 focus:border-primary pr-8"
                            />
                        </div>

                        <div>
                            <Typography variant="body2" className="mb-2 font-medium">Search people or department</Typography>
                            <div className="relative">
                                <Input
                                    value={searchPeopleText}
                                    onChange={(e) => {
                                        setSearchPeopleText(e.target.value)
                                    }}
                                    placeholder="Start searching..."
                                    className="w-full border-b border-gray-300 rounded-none px-0 py-1 text-base border-t-0 border-x-0 border-b-primary focus-visible:ring-0 focus:border-primary pr-8"
                                />
                                {isSearchingPeople ? (
                                    <Loader2 className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
                                ) : (
                                    <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                )}
                            </div>
                        </div>

                        <div className="mt-4 max-h-96 overflow-y-auto">
                            {isSearchingPeople ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                                    <Typography variant="body2" className="ml-2 text-gray-500">Searching people...</Typography>
                                </div>
                            ) : filteredPeople.length > 0 ? (
                                filteredPeople.map((person: any) => (
                                    <div
                                        key={person.user}
                                        className="flex items-center justify-between mb-2 p-2 rounded hover:bg-gray-50 gap-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 flex-none rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                                                {person.username[0]}
                                            </div>
                                            <div className="flex flex-col flex-1">
                                                <Typography variant="body1" className="font-medium">{person.name}</Typography>
                                                <Typography variant="caption" className="text-gray-500">
                                                    {person.username}
                                                </Typography>
                                                <div className="flex gap-1 flex-wrap mt-1">
                                                    {person.teamDetails && person.teamDetails.map((team: any, index: number) => (
                                                        <span
                                                            key={index}
                                                            className="inline-block bg-primary rounded-full text-white px-3 py-1 text-xs"
                                                        >
                                                            {team.teamName}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        {selectedPeople.find(p => p.user === person.user) ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleRemovePerson(person.user)}
                                                className="text-gray-600 border-gray-300 hover:border-gray-400"
                                            >
                                                REMOVE
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="default"
                                                size="sm"
                                                onClick={() => handleAddPerson(person)}
                                                className=""
                                            >
                                                ADD
                                            </Button>
                                        )}
                                    </div>
                                ))
                            ) : searchPeopleText.length >= 2 ? (
                                <div className="flex items-center justify-center py-8">
                                    <Typography variant="body2" className="text-gray-500">No people found</Typography>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center py-8">
                                    <Typography variant="body2" className="text-gray-500">Start typing to search people</Typography>
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="pt-4 border-t">
                        <Button
                            variant="ghost"
                            onClick={handleCreatePanelClose}
                            className="text-gray-600"
                            disabled={isCreatingPanel}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="default"
                            disabled={!panelName || selectedPeople.length === 0 || isCreatingPanel}
                            onClick={createPanel}
                        >
                            {isCreatingPanel ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Panel'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default DecisionHubSelectPanel
