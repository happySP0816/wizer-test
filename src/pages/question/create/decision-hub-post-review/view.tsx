import React from 'react';
import { Badge } from '@/components/components/ui/badge';
import { Card, CardContent } from '@/components/components/ui/card';
import { Typography } from '@/components/components/ui/typography';
import { useExpirationInfo } from './helper';
import DecisionHubTitleCard from './title-card';
import EditPreviewButton from './edit-button';
import StrengthMeter from './strength-meter';
import type { DecisionHubPostTotalPreviewProps } from './types';

const title = 'Review & Post';
const subTitle = 'Review your question here and post when ready!';

const DecisionHubPostTotalPreview: React.FC<DecisionHubPostTotalPreviewProps> = ({
  strengthReview,
  previewData,
  topicTitle,
  decisionCrowds,
  selectedCrowdPreview,
  selectedPeopleReview,
  selectedImage,
  setActiveStep,
  setSubmitBtn,
}) => {
  const questionContentMap = {
    yes_or_no: <>Yes or No</>,
    multiple_choice: <>Multiple Choice</>,
    ranking: <>Ranking</>,
    open_ended: <>Open Ended</>
  };

  const { question, description, questionType, medias, duration, options } = previewData;
  const expirationInfo = useExpirationInfo(duration);
  
  // Type guard to check if selectedImage is a File
  const isFile = (item: any): item is File => item instanceof File;
  const isSelectedImageObject = (item: any): item is { type?: string; image?: any[] } => 
    typeof item === 'object' && item !== null && !isFile(item);

  return (
    <div className="space-y-6">
      <DecisionHubTitleCard title={title} subTitle={subTitle} />
      
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6 space-y-6">
          {/* Question Review */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Typography variant="h4" className="text-xl font-semibold text-gray-900 mb-2">
                {question}
              </Typography>
              <Typography variant="body1" className="text-gray-600">
                {description}
              </Typography>
            </div>
            <EditPreviewButton onClick={() => setActiveStep(0)} />
          </div>

          {/* Question Type Review */}
          <div className="flex items-center justify-between">
            <Typography variant="h4" className="text-lg font-medium text-gray-900">
              {questionContentMap[questionType] || <div>Unknown Question Type</div>}
            </Typography>
            <EditPreviewButton onClick={() => { setActiveStep(1); setSubmitBtn(false); }} />
          </div>

          {/* Options Review for Yes/No */}
          {questionType === 'yes_or_no' && (
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Typography variant="h4" className="text-lg font-medium text-gray-900 mb-3">
                  Options:
                </Typography>
                <ul className="list-disc list-inside space-y-1">
                  {options.map((option, id) => (
                    <li key={id} className="text-gray-700">
                      {option?.text}
                    </li>
                  ))}
                </ul>
              </div>
              <EditPreviewButton onClick={() => { setActiveStep(3); setSubmitBtn(false); }} />
            </div>
          )}

          {/* Media Review for Yes/No */}
          {questionType === 'yes_or_no' && isFile(selectedImage) && selectedImage.type && typeof window !== 'undefined' && (
            <div className="space-y-3">
              <Typography variant="h4" className="text-lg font-medium text-gray-900">
                Media:
              </Typography>
              <div className="max-w-md">
                {selectedImage.type.startsWith('image') ? (
                  <img 
                    src={URL.createObjectURL(selectedImage)} 
                    alt="Preview" 
                    className="w-full h-auto rounded-lg border"
                  />
                ) : (
                  <video 
                    src={URL.createObjectURL(selectedImage)}
                    controls={false}
                    loop
                    autoPlay
                    className="w-full h-auto rounded-lg border"
                  />
                )}
              </div>
            </div>
          )}

          {/* Multiple Choice Options */}
          {questionType === 'multiple_choice' && isSelectedImageObject(selectedImage) && selectedImage.image && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Typography variant="h4" className="text-lg font-medium text-gray-900">
                  Options:
                </Typography>
                <EditPreviewButton onClick={() => { setActiveStep(3); setSubmitBtn(false); }} />
              </div>
              <div className="grid gap-4">
                {selectedImage.image.map((item, id) => (
                  <div key={id} className="flex items-center gap-3 p-3 border rounded-lg">
                    {item.image !== null && typeof window !== 'undefined' && (
                      <img 
                        src={URL.createObjectURL(item.image)} 
                        alt="Option" 
                        className="w-16 h-16 object-cover rounded border"
                      />
                    )}
                    <span className="text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ranking Options */}
          {questionType === 'ranking' && isSelectedImageObject(selectedImage) && selectedImage.image && (
            <div className="space-y-4">
              <Typography variant="h4" className="text-lg font-medium text-gray-900">
                Options:
              </Typography>
              <div className="grid gap-4">
                {selectedImage.image.map((item, id) => (
                  <div key={id} className="flex items-center gap-3 p-3 border rounded-lg">
                    {item.image !== null && typeof window !== 'undefined' && (
                      <img 
                        src={URL.createObjectURL(item.image)} 
                        alt="Option" 
                        className="w-16 h-16 object-cover rounded border"
                      />
                    )}
                    <span className="text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Open Ended Options */}
          {questionType === 'open_ended' && isSelectedImageObject(selectedImage) && selectedImage.image && (
            <div className="space-y-4">
              <Typography variant="h4" className="text-lg font-medium text-gray-900">
                Options:
              </Typography>
              <div className="grid gap-4">
                {selectedImage.image.map((item, id) => (
                  <div key={id} className="flex items-center gap-3 p-3 border rounded-lg">
                    {item.image !== null && typeof window !== 'undefined' && (
                      <img 
                        src={URL.createObjectURL(item.image)} 
                        alt="Option" 
                        className="w-16 h-16 object-cover rounded border"
                      />
                    )}
                    <span className="text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Duration Review */}
          <div className="flex items-center justify-between">
            <Typography variant="h4" className="text-lg font-medium text-gray-900">
              {expirationInfo}
            </Typography>
            <EditPreviewButton onClick={() => setActiveStep(4)} />
          </div>

          {/* Crowds Review */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Typography variant="h4" className="text-lg font-medium text-gray-900">
                Panel Strength
              </Typography>
              <StrengthMeter strength={strengthReview} />
            </div>
            <EditPreviewButton onClick={() => { setActiveStep(5); setSubmitBtn(false); }} />
          </div>

          {/* Panel and People Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Typography variant="h6" className="text-base font-medium text-gray-900 mb-3">
                Panel
              </Typography>
              <div className="flex flex-wrap gap-2">
                {selectedCrowdPreview?.map((crowd, id) => (
                  <Badge 
                    key={`crowd-${id}`}
                    variant="secondary"
                    className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                  >
                    {decisionCrowds?.find(item => item.id === crowd)?.title}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <Typography variant="h6" className="text-base font-medium text-gray-900 mb-3">
                Selected People
              </Typography>
              <div className="flex flex-wrap gap-2">
                {selectedPeopleReview?.map((data, id) => (
                  <Badge 
                    key={`person-${id}`}
                    variant="secondary"
                    className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                  >
                    {data.username}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DecisionHubPostTotalPreview;
