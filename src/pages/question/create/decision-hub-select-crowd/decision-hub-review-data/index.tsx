import type { FC } from "react"
import { useState } from "react"
import { Typography } from "@/components/components/ui/typography"
import { Input } from "@/components/components/ui/input"
import { Button } from "@/components/components/ui/button"

interface DecisionHubReviewDataProps {
    selectedMembers: any[]
    selectedCrowds: any[]
    diversity: number
    expertise: number
    age: number
}

const ArrowIcon: FC = () => (
    <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 16V0L19 8L0 16ZM2 13L13.85 8L2 3V6.5L8 8L2 9.5V13ZM2 13V8V3V6.5V9.5V13Z" fill="#1D1B20" />
    </svg>
)

const DecisionHubReviewData: FC<DecisionHubReviewDataProps> = ({ selectedMembers, selectedCrowds, diversity, expertise, age }) => {
    const [emailInput, setEmailInput] = useState("");

    return (
        <div className='flex flex-col gap-2 justify-between p-6 h-full'>
            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <div className="text-center flex-1">
                        <Typography variant="h3" className="text-black">QUESTIONS</Typography>
                        <Typography variant="h1" className="font-bold text-black">
                            1
                        </Typography>
                        <Typography variant="caption" className="text-black">
                            no. of questions in your study
                        </Typography>
                    </div>
                    <div className="text-center flex-1">
                        <Typography variant="h3" className="text-black">TOTAL COUNT</Typography>
                        <Typography variant="h1" className="font-bold text-black">
                            {selectedMembers.length + selectedCrowds.length}
                        </Typography>
                        <Typography variant="caption" className="text-black">
                            no. of people selected to participate
                            <br />
                            (includ. panels)
                        </Typography>
                    </div>
                </div>
                <div className="mb-2">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-start gap-2 content-start">
                            <div className="flex flex-col items-start w-[100px]">
                                <Typography variant="h6" className="font-medium text-black">
                                    Diversity
                                </Typography>
                                <Typography variant="caption" className="text-gray-500">
                                    Recommend
                                </Typography>
                            </div>
                            <div className="flex-1 relative">
                                <div className="h-[15px] mt-1.5 w-full rounded-full border border-gray-300" style={{ background: `linear-gradient(to right, rgba(123, 105, 175, 1) 0%, rgba(123, 105, 175, 0.5) ${diversity}%, rgba(255, 255, 255, 1) 100%)` }}></div>
                                <div className="absolute top-0" style={{ left: `${diversity}%`, transform: 'translateX(-50%)' }}>
                                    <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-black"></div>
                                </div>
                                <Typography variant="caption" className="text-gray-500 text-right block mt-1">
                                    Age {Math.floor(age)}+
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mb-2">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-start gap-2 content-start">
                            <div className="flex flex-col items-start w-[100px]">
                                <Typography variant="h6" className="font-medium text-black">
                                    Experience
                                </Typography>
                                <Typography variant="caption" className="text-gray-500">
                                    Recommend
                                </Typography>
                            </div>
                            <div className="flex-1 relative">
                                <div className="h-[15px] mt-1.5 w-full rounded-full border border-gray-300" style={{ background: `linear-gradient(to right, rgba(123, 105, 175, 1) 0%, rgba(123, 105, 175, 0.5) ${expertise}%, rgba(255, 255, 255, 1) 100%)` }}></div>
                                <div className="absolute top-0" style={{ left: `${expertise}%`, transform: 'translateX(-50%)' }}>
                                    <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-black"></div>
                                </div>
                                <Typography variant="caption" className="text-gray-500 text-left block mt-1">
                                    Strategy & Planning <br />Creative & Program Design <br />Execution & Delivery <br />Business & Commercial <br />Engagement & Communication <br />Policy & Government
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mb-2">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-start gap-2 content-start">
                            <div className="flex flex-col items-start w-[100px]">
                                <Typography variant="h6" className="font-medium text-black">
                                    Decision Style
                                </Typography>
                                <Typography variant="caption" className="text-gray-500">
                                    Recommend
                                </Typography>
                            </div>
                            <div className="flex-1 relative">
                                <div className="h-[15px] mt-1.5 w-full rounded-full border border-gray-300" style={{ background: `linear-gradient(to right, rgba(123, 105, 175, 1) 0%, rgba(123, 105, 175, 0.5) ${20}%, rgba(255, 255, 255, 1) 100%)` }}></div>
                                <div className="absolute top-0" style={{ left: `${20}%`, transform: 'translateX(-50%)' }}>
                                    <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-black"></div>
                                </div>
                                <Typography variant="caption" className="text-gray-500 text-left block mt-1">
                                    Add missing archetypes:
                                </Typography>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <Typography variant="caption" className="text-gray-500">
                                            Visionary
                                        </Typography>
                                        <Typography variant="caption" className="text-gray-500">
                                            Visionary
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-auto">
                <Typography variant="body1" className="font-medium text-black">
                    Invite people to your study
                </Typography>
                <div className="flex items-center gap-2 w-full">
                    <Input
                        className="flex-1 rounded-none border-b border-b-[#ccc] text-base focus-visible:ring-0"
                        placeholder="email addresses separated by comma"
                        value={emailInput}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailInput(e.target.value)}
                    />
                    <Button
                        type="button"
                        size="icon"
                        className="bg-transparent hover:bg-gray-100 rounded-full p-2"
                    >
                        <ArrowIcon />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default DecisionHubReviewData
