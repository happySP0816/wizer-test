export interface Option {
  text: string;
  id?: string;
}

export interface MediaItem {
  image: File | null;
  text: string;
  id?: string;
}

export interface PreviewData {
  question: string;
  description: string;
  questionType: 'yes_or_no' | 'multiple_choice' | 'ranking' | 'open_ended';
  medias?: File[];
  duration: number;
  options: Option[];
}

export interface DecisionCrowd {
  id: string;
  title: string;
}

export interface SelectedPerson {
  username: string;
  id: string;
}

export interface SelectedImage {
  type?: string;
  image?: MediaItem[];
}

export interface DecisionHubPostTotalPreviewProps {
  strengthReview: number;
  previewData: PreviewData;
  topicTitle?: string;
  decisionCrowds: DecisionCrowd[];
  selectedCrowdPreview: string[];
  selectedPeopleReview: SelectedPerson[];
  selectedImage: SelectedImage | File;
  setActiveStep: (step: number) => void;
  setSubmitBtn: (enabled: boolean) => void;
} 