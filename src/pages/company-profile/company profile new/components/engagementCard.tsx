import React, { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/components/ui/accordion";
import { CheckSquare } from "lucide-react";
import { MetricCard } from "./MetricCard";

type EngagementCardProps = {
  data: {
    metrics: any[];
    voteData: any[];
  };
};

const EngagementCard = ({ data }: EngagementCardProps) => {
  const [selectedView, setSelectedView] = useState("Internal");

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-10">What's Driving Engagement?</h2>
      <div className="border-b border-black mx-11 mb-6" />
      <div className="flex flex-wrap gap-4 px-11 pb-11">
        {data.metrics.length > 0 ? (
          data.metrics.map((metric) => (
            <div key={metric.id} className="flex-1 min-w-[200px] max-w-[250px]">
              {/* You need to convert MetricCard to use Tailwind/shadcn */}
              <MetricCard {...metric} />
            </div>
          ))
        ) : (
          <p className="text-left text-muted-foreground">No Data Available</p>
        )}
      </div>
      <h3 className="text-xl font-semibold mt-10 mb-4">Top Questions</h3>
      {data.voteData.length > 0 ? (
        <Accordion type="multiple" className="w-full">
          {data.voteData.map((voteData: any, index: number) => (
            <AccordionItem key={index} value={`item-${index}`} defaultOpen={index === 0}>
              <AccordionTrigger>
                <div className="flex justify-between w-full items-center">
                  <span>
                    <span className="font-bold">QUESTION {index + 1}:</span> {voteData.question}
                  </span>
                  <span className="text-base">Responses</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col md:flex-row gap-6 py-6">
                  {/* Recommended Option */}
                  <div className="border-2 border-purple-200 rounded-lg p-4 bg-white flex-1 min-w-[180px] text-center">
                    <div className="uppercase text-xs font-bold text-muted-foreground">Recommended Option</div>
                    <div className="text-xl font-bold mt-2">{voteData.recommendedOption}</div>
                  </div>
                  {/* All Votes */}
                  <div className="flex-1 min-w-[180px] flex flex-col items-center justify-center">
                    <div className="flex items-center font-bold mb-2">
                      <CheckSquare className="w-4 h-4 mr-1" />
                      {voteData.votes}
                    </div>
                    <div className="font-bold mb-2">All votes</div>
                    <div className="relative flex items-center justify-center">
                      <svg width="80" height="80" className="absolute">
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          stroke="#9d9d9d"
                          strokeWidth="4"
                          fill="none"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          stroke="#ff9800"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray={2 * Math.PI * 36}
                          strokeDashoffset={
                            2 * Math.PI * 36 * (1 - voteData.percentage / 100)
                          }
                          style={{ transition: "stroke-dashoffset 0.5s" }}
                        />
                      </svg>
                      <span className="absolute text-lg font-bold">
                        {Math.round(parseFloat(voteData.percentage))}%
                      </span>
                    </div>
                  </div>
                  {/* Small Circles */}
                  <div className="flex-1 min-w-[200px] flex flex-wrap gap-4 justify-center">
                    {voteData.smallVoteData.map((vote: any, idx: number) => (
                      <div key={idx} className="text-center min-w-[120px]">
                        <div className="text-xs uppercase text-muted-foreground mb-1">{vote.type}</div>
                        {vote.data && vote.data[0] && vote.data[0].users &&
                          Object.entries(vote.data[0].users).map(
                            ([key, userData], userIndex) => {
                              const uData = userData as { count: number; percentage: string };
                              return userIndex === 0 ? (
                                <div key={key}>
                                  <div className="text-sm font-bold mb-1">{key}</div>
                                  <div className="relative flex items-center justify-center">
                                    <svg width="50" height="50" className="absolute">
                                      <circle
                                        cx="25"
                                        cy="25"
                                        r="21"
                                        stroke="#9d9d9d"
                                        strokeWidth="4"
                                        fill="none"
                                      />
                                      <circle
                                        cx="25"
                                        cy="25"
                                        r="21"
                                        stroke="#ff9800"
                                        strokeWidth="4"
                                        fill="none"
                                        strokeDasharray={2 * Math.PI * 21}
                                        strokeDashoffset={
                                          2 * Math.PI * 21 * (1 - parseFloat(uData.percentage) / 100)
                                        }
                                        style={{ transition: "stroke-dashoffset 0.5s" }}
                                      />
                                    </svg>
                                    <span className="absolute text-base font-bold">
                                      {parseInt(uData.percentage)}%
                                    </span>
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {uData.count} votes
                                  </div>
                                </div>
                              ) : null;
                            }
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <p className="text-left text-muted-foreground mt-2">No Data Available</p>
      )}
    </div>
  );
};

export default EngagementCard;