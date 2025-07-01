import React from 'react';
import { Button } from '@/components/components/ui/button';
import { Edit } from 'lucide-react';

interface EditPreviewButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
}

const EditPreviewButton: React.FC<EditPreviewButtonProps> = ({ onClick, children }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400"
    >
      <Edit className="h-4 w-4" />
      {children || 'Edit'}
    </Button>
  );
};

export default EditPreviewButton;
