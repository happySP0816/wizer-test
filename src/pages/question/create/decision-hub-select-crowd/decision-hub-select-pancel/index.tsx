import { useCallback, useEffect, useState, type ChangeEvent, type FC } from 'react'
import { getDecisionHubCrowds } from '@/apis/decision-hub'
import { Button } from '@/components/components/ui/button'
import { Typography } from '@/components/components/ui/typography'
import { Input } from '@/components/components/ui/input'
import { getCrowds } from '@/apis/crowds'

const DecisionHubSelectPanel: FC<any> = ({ selectedCrowds, setSelectedCrowds }) => {
    const [searchString, setSearchString] = useState<string>('')
    const [searchResults, setSearchResults] = useState<any[]>([])

    useEffect(() => {
        getAllCrowd()
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
            const response = await getDecisionHubCrowds(params)
            setSearchResults(response || [])
        } catch (error) {
            console.error('Error searching decision panels:', error)
        }
    }

    const getAllCrowd = async () => {
        try {
            const response = await getCrowds()
            setSearchResults(response || [])
        } catch (error) {
            console.error('Error searching decision panels:', error)
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

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            {selectedCrowds && selectedCrowds.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCrowds.map((crowdId: number, index: number) => {
                        const crowd = searchResults.find((c: any) => c.id === crowdId);
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
                <Input
                    className="w-full border-b border-gray-300 rounded-none pl-0 pr-0 text-base focus-visible:ring-0 focus-visible:border-purple-400"
                    onChange={handleSearchInputChange}
                    value={searchString}
                    placeholder="Search panels..."
                />
            </div>
            <div className="flex flex-col gap-2">
                {searchResults.length > 0 && searchResults.map((panel: any, index: number) => {
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
                })}
            </div>
        </div>
    )
}

export default DecisionHubSelectPanel
