import React, { useState, useEffect } from 'react';
import TraitSection from './trait-section';
import JulietTraitSection from './juliet-trait-section';
import { getDynamicInsight } from '@/utils/traitCombinationDynamic';
import { getBigFiveCombinationInsight } from '@/utils/bigFiveCombinationInsights';
import { topTraitText } from '@/utils/topTraitText';
import { mainProfileDescriptions } from '@/utils/mainProfileDescriptions';
import { Button } from '@/components/components/ui/button';
import { Typography } from '@/components/components/ui/typography';

const getTopTwoTraits = (traitScores: Record<string, number>) => {
  const sortedTraits = Object.entries(traitScores)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
  return {
    topTrait: sortedTraits[0]?.[0] || '',
    secondTrait: sortedTraits[1]?.[0] || ''
  };
};

interface DecisionProfileTabsProps {
  scores: any;
  traitDescriptions: any;
  profileDynamicDescriptions: any;
}

export const DecisionProfileTabs = ({ scores, profileDynamicDescriptions }: DecisionProfileTabsProps) => {
  const [value, setValue] = useState(0);
  const [selectedTrait, setSelectedTrait] = useState<string>('Risks');
  const [selectedBigFiveTrait, setSelectedBigFiveTrait] = useState<string>('Imagination');
  const [, setModalOpen] = useState(false);
  const [premiumAccess] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const { topTrait, secondTrait } = getTopTwoTraits(scores['juliet'] || {});
  const getScoreCategory = (trait: string, score: number): 'high' | 'medium' | 'low' => {
    const upperTrait = trait.toLowerCase();
    if (['imagination', 'extraversion', 'agreeableness', 'conscientiousness', 'emotional stability'].includes(upperTrait)) {
      if (score >= 70) return 'high';
      if (score >= 35) return 'medium';
      return 'low';
    }
    return 'medium';
  };

  const handleUnlockClick = () => setModalOpen(true);
  const handleChange = (idx: number) => setValue(idx);

  const scrollToSection = (sectionId: string) => {
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveSection(sectionId);
      }
    }, 150);
  };

  const tabLabels = [
    'Understanding Your Decision Profile',
    'Strengths & Core Traits',
    'Collaborating with Others',
    'Actionable Strategies for Growth',
    'Summary',
  ];
  const content = mainProfileDescriptions[scores['profiletype']]?.[tabLabels[value]] || '';

  useEffect(() => {
    const container = document.getElementById('main-content');
    const handleScroll = () => {
      if (!content || !Array.isArray(content)) return;
      let activeId: string | null = null;
      (content as any[]).forEach((section: any) => {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
          if (isInViewport) {
            activeId = section.id;
          }
        }
      });
      if (activeId && activeId !== activeSection) {
        setActiveSection(activeId);
      }
    };
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();
    }
    return () => container?.removeEventListener('scroll', handleScroll);
  }, [content, activeSection]);

  useEffect(() => {
    if (content && (content as any[]).length > 0) {
      const firstValidSection = (content as any[]).find((section: any) => section.id);
      if (firstValidSection) {
        setActiveSection(firstValidSection.id);
      }
    }
  }, [content, value]);

  const isLocked = !premiumAccess;

  const renderLocked = () => (
    <div className="flex flex-row gap-6 bg-white border rounded-none rounded-b-md p-6 min-h-[400px] max-h-[470px]">
      <div className="flex-1 relative max-h-[600px] overflow-y-auto pr-8 text-sm leading-6" id="main-content">
        {Array.isArray(content) && content.map((section: any, index: number) => (
          <div key={index} className="mb-5">
            {section.title === 'Your Decision Profile' ? (
              <h2 id={section.id} className="text-lg font-extrabold text-gray-800 mt-6 mb-4">
                {section.title}: <span className="text-purple-600 ml-1">{scores['profiletype']}</span>
              </h2>
            ) : section.title1 ? (
              <div className="flex items-center gap-2 mt-6 mb-4">
                <h2 id={section.id} className="text-lg font-extrabold text-gray-800">
                  {section.title} <span className="text-purple-600 ml-1">{section.title1}</span>
                </h2>
                <img src={`/images/decision-profile/${section.title1}.png`} alt="Section icon" className="w-10 h-10 object-contain" />
              </div>
            ) : (
              <h2 id={section.id} className="text-lg font-extrabold text-gray-800 mt-6 mb-4">{section.title}</h2>
            )}
            {section.trait && (
              <TraitSection
                scores={scores}
                selectedTrait={selectedBigFiveTrait}
                setSelectedTrait={setSelectedBigFiveTrait}
                type="big 5"
              />
            )}
            {section.juliet && (
              <JulietTraitSection
                scores={scores}
                selectedTrait={selectedTrait}
                setSelectedTrait={setSelectedTrait}
                type="juliet"
              />
            )}
            {section.trait && (
              <div className="my-4" dangerouslySetInnerHTML={{ __html: profileDynamicDescriptions[selectedBigFiveTrait]?.[getScoreCategory(selectedBigFiveTrait, scores['big 5'][selectedBigFiveTrait])] }} />
            )}
            {section.juliet && (
              <div className="my-4 text-sm" dangerouslySetInnerHTML={{ __html: `<strong>Note:</strong> This chart highlights your <strong>primary cognitive decision-making styles</strong> — the mental frameworks you're most likely to rely on when making decisions. <strong>Lower scores aren't weaknesses</strong> — they simply show areas you're less inclined to focus on by default. The goal isn't to score high in every area, but to understand your natural preferences and how they complement other styles in a team. Great decision-making happens when diverse perspectives come together — knowing your style is the first step in building stronger, more balanced decisions.` }} />
            )}
            {section.juliet && (
              <div className="my-4" dangerouslySetInnerHTML={{ __html: topTraitText[topTrait] }} />
            )}
            {section.juliet && (
              <div className="my-4" dangerouslySetInnerHTML={{ __html: profileDynamicDescriptions[selectedTrait]?.[getScoreCategory(selectedTrait, scores['juliet'][selectedTrait])] }} />
            )}
            {/* Insights and content blocks */}
            {section.insights && section.contentStong && section.juliet && section.contentStong.map((strongSection: any, idx: number) => (
              <div key={idx} className="bg-purple-100 p-4 rounded-xl max-w-full my-4">
                <p className="font-bold text-base mb-1">{strongSection.title}</p>
                <p className="text-base">{getDynamicInsight(topTrait, secondTrait)}</p>
              </div>
            ))}
            {section.insights && section.contentStong && section.trait && section.contentStong.map((strongSection: any, idx: number) => (
              <div key={idx} className="bg-purple-100 p-4 rounded-xl max-w-full my-4">
                <p className="font-bold text-base mb-1">{strongSection.title}</p>
                <p className="text-base">{getBigFiveCombinationInsight(scores['big 5'])}</p>
              </div>
            ))}
            {section.insights && section.contentStong && !section.juliet && !section.trait && section.contentStong.map((strongSection: any, idx: number) => (
              <div key={idx} className="bg-purple-100 p-4 rounded-xl max-w-full my-4">
                <p className="font-bold text-base mb-1">{strongSection.title}</p>
                <p className="text-base">{strongSection.content}</p>
              </div>
            ))}
            {section.insights && section.content && (
              <div className="bg-purple-100 p-4 rounded-xl max-w-xl my-4">
                <p className="font-bold text-base mb-1">{section.title}</p>
                <p className="text-base">{section.content}</p>
              </div>
            )}
            {section.content2 && <p className="font-extrabold text-sm text-gray-800 pl-2">{section.content2}</p>}
            {section.contentStong && section.insights !== true && section.contentStong.map((strongSection: any, idx: number) => (
              <p key={idx} className="pl-2 text-sm text-gray-800"><strong>{strongSection.title} </strong>{strongSection.content}</p>
            ))}
            {section.content && section.insights !== true && <p className="text-sm text-gray-800">{section.content}</p>}
            {section.content1 && <p className="text-sm text-gray-800">{section.content1}</p>}
            {section.list && (
              <ul className="list-disc pl-6">
                {section.list.map((item: string, idx: number) => (
                  <li key={idx} className="text-sm text-gray-800 flex items-center">
                    <span className="text-purple-600 mr-2">&#9658;</span>
                    <span>{item.split("\n").map((line: string, index: number) => (
                      <React.Fragment key={index}>
                        {line}
                        {index !== item.split("\n").length - 1 && <br />}
                      </React.Fragment>
                    ))}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        {value === 0 && isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 rounded-lg border border-purple-400 z-10 p-8">
            <p className="text-center text-base mb-4 max-w-[75%]">This content is for subscribing organizations only (or a one-time fee for individuals)</p>
            <h3 className="text-xl font-bold text-center mb-4 max-w-[75%]">Continue reading for less than a cup of coffee (placeholder text)</h3>
            <p className="text-center text-base mb-4">Add message here that clearly communicates the benefits of upgrading, such as exclusive content or advanced features. Use bullet points or icons for easy scanning, and keep the messaging simple and user-focused.</p>
            <Button onClick={() => { }} className="mt-2">unlock exclusive features</Button>
          </div>
        )}
      </div>
      {/* Contents Panel */}
      <div className="flex-shrink-0 pl-8 border-l border-gray-200 min-w-[240px] max-w-[320px]">
        <Typography variant="h6" className="mb-2 ml-6">Contents</Typography>
        <div className="flex flex-col gap-1 ml-6">
          {Array.isArray(content) && content.map((section) => (
            <button
              key={section.id}
              className={`text-xs mb-1 text-left cursor-pointer ${activeSection === section.id ? 'text-purple-600 font-bold' : 'text-gray-600 font-normal'} hover:text-purple-600`}
              onClick={() => scrollToSection(section.id)}
            >
              {section.title}
            </button>
          ))}
        </div>
        {isLocked && value !== 0 && (
          <div className="flex flex-col items-center justify-center bg-white bg-opacity-70 mt-4 ml-4 w-[90%] h-[153px] border border-purple-400 p-4 rounded-lg shadow-md">
            <Typography variant="h6" className="text-center mb-2">Learn more with Insights <span className="text-purple-600">*</span></Typography>
            <Button onClick={handleUnlockClick} className="mt-2">unlock premium</Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full mt-8 px-12 pb-8">
      <div className="bg-white rounded-lg shadow-none">
        <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
          {tabLabels.map((label, idx) => (
            <Button
              key={label}
              className={`h-[25px] cursor-pointer px-4 text-sm rounded-none rounded-t-xs font-medium transition-colors duration-700 ${value === idx ? 'bg-primary text-white font-semibold border' : 'bg-gray-200 text-gray-700'} hover:!text-white focus:!outline-none`}
              onClick={() => handleChange(idx)}
            >
              {label}
            </Button>
          ))}
        </div>
        {renderLocked()}
      </div>
    </div>
  );
};

export default DecisionProfileTabs;