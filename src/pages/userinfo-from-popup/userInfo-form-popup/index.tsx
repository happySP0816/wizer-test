import React, { useState, useCallback, useEffect, useMemo, useRef, Fragment } from 'react';
import BlankUserDetails from './blank-user-details';
import BlankPersonality from './blank-personality';
import BlankDiversity from './blank-diversity';
import { editPersonalityQuestionsAnswers, getUserPersonalityQuestions } from '@/apis/profile';
import type { UserInfoMainProps, UserProfile } from './type';
import { Button } from '@/components/components/ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from '@/components/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';

const UserInfoMain: React.FC<UserInfoMainProps> = ({ userProfile }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [missingUserInfo, setMissingUserInfo] = useState(0);
  const [personalityStatus, setPersonalityStatus] = useState(0);
  const [personalityQuestions, setPersonalityQuestions] = useState<any[] | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [disableSave, setDisableSave] = useState(true);  

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [, setSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const childRef = useRef<{ handleSaveUserData: () => void } | null>(null);
  const diversityChildRef = useRef<any>(null);
  const navigate = useNavigate();

  const callChildSaveFunction = async () => {
    if (childRef.current) {
      try {
        await childRef.current.handleSaveUserData();
        if (steps.length > 1) {
          handleNext();
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        setSeverity('error');
        setSnackbarMessage('Failed to save user data.');
        setSnackbarOpen(true);
      }
    }
  };

  useEffect(() => {
    const fetchPersonalityQuestions = async () => {
      const response = await getUserPersonalityQuestions();
      setPersonalityStatus(response.personalityQuestionsAnswers?.length);
      setPersonalityQuestions(response.personalityQuestions);
    };
    fetchPersonalityQuestions();
  }, []);

  useEffect(() => {
    const missingFields = ['username', 'bio', 'birthday', 'gender', 'location'].filter(
      field => !userProfile[field as keyof UserProfile]
    );
    setMissingUserInfo(missingFields.length);
  }, [userProfile]);

  const personalInfoLength = useMemo(
    () =>
      [
        userProfile.educations?.length ?? 0,
        userProfile.hobbiesOrInterests?.length ?? 0,
        userProfile.ethnicities?.length ?? 0,
        userProfile.professions?.length ?? 0
      ].reduce((sum, length) => sum + length, 0),
    [userProfile.educations, userProfile.hobbiesOrInterests, userProfile.ethnicities, userProfile.professions]
  );

  const revalidateSteps = useCallback(() => {
    const steps = [
      {
        condition: missingUserInfo >= 1,
        label: 'User Details',
        component: (
          <BlankUserDetails
            userProfile={userProfile}
            ref={childRef}
            onUpdateFormValidity={(isValid: boolean) => setIsFormValid(isValid)}
          />
        )
      },
      {
        condition: personalityStatus < 4,
        label: 'Personality',
        component: (
          <BlankPersonality
            setPersonalityQuestions={setPersonalityQuestions}
            personalityQuestions={personalityQuestions || []}
            setSeverity={(severity: string) => setSeverity(severity as 'success' | 'error' | 'info' | 'warning')}
            setSnackbarMessage={setSnackbarMessage}
            setSnackbarOpen={setSnackbarOpen}
          />
        )
      },
      {
        condition: personalInfoLength < 4,
        label: 'Diversity',
        component: <BlankDiversity ref={diversityChildRef} setDisableSave={setDisableSave} />
      }
    ].filter(step => step.condition);
    return steps;
  }, [missingUserInfo, personalityStatus, personalInfoLength, userProfile, personalityQuestions]);

  const steps = revalidateSteps();
  const handleNext = useCallback(() => {
    if (isFormValid) {
      setActiveStep(prev => prev + 1);
    }
  }, [isFormValid]);

  const handleSaveData = () => {
    if (diversityChildRef.current) {
      diversityChildRef.current.saveAllData();
      navigate('/dashboard');
    }
  };

  const savePersonality = async () => {
    if (!personalityQuestions || !Array.isArray(personalityQuestions)) {
      setSeverity('error');
      setSnackbarMessage('Personality questions not loaded yet. Please try again.');
      setSnackbarOpen(true);
      return;
    }
    const unansweredQuestions = personalityQuestions.filter(q => q.answer === null);
    if (unansweredQuestions.length > 0) {
      setSeverity('error');
      setSnackbarMessage('Please answer all questions');
      setSnackbarOpen(true);
    } else {
      const res = await editPersonalityQuestionsAnswers(personalityQuestions);
      if (res) {
        setSeverity('success');
        setSnackbarMessage('Personality Answer Added Successfully');
        setSnackbarOpen(true);
        handleNext();
        navigate('/dashboard');
        const remainingQuestions = personalityQuestions.filter(question => question.answer === null);
        setPersonalityQuestions(remainingQuestions);
      } else {
        setSeverity('error');
        setSnackbarMessage('Unable To Save Personality answer');
        setSnackbarOpen(true);
      }
    }
  };

  return (
    <Fragment>
      <div className="max-w-2xl mx-auto relative">
        {steps.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-8">
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep === idx ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>{idx + 1}</div>
                  <span className="mt-2 text-sm">{step.label}</span>
                  {idx < steps.length - 1 && <div className="flex-1 h-1 bg-gray-300 mx-2" />}
                </div>
              ))}
            </div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Welcome to the Wizer Decision Community!</h2>
              <p className="text-base text-gray-600">We're excited to get to know you better. Please fill out the following information to complete your profile.</p>
            </div>
            <div>{steps[activeStep]?.component}</div>
            <div className="flex justify-end mt-8 gap-4">
              {steps[activeStep]?.label === 'User Details' && (
                <Button disabled={!isFormValid} onClick={callChildSaveFunction}>
                  {steps.length > 1 ? 'Next' : 'Finish'}
                </Button>
              )}
              {steps[activeStep]?.label === 'Personality' && (
                <Button disabled={personalityStatus >= 9} onClick={savePersonality}>
                  Next
                </Button>
              )}
              {steps[activeStep]?.label === 'Diversity' && (
                <Button disabled={disableSave} onClick={handleSaveData}>
                  Finish
                </Button>
              )}
            </div>
          </>
        )}
      </div>
      <AlertDialog open={snackbarOpen} onOpenChange={() => setSnackbarOpen(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{snackbarMessage}</AlertDialogTitle>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </Fragment>
  );
};

export default UserInfoMain;