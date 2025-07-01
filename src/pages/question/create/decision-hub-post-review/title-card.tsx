import React from 'react';
import { Card, CardContent } from '@/components/components/ui/card';
import { Typography } from '@/components/components/ui/typography';

interface DecisionHubTitleCardProps {
  title: string;
  subTitle: string;
}

const DecisionHubTitleCard: React.FC<DecisionHubTitleCardProps> = ({ title, subTitle }) => {
  return (
    <Card className="mb-6 border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardContent className="p-6">
        <Typography variant="h3" className="text-2xl font-bold text-gray-900 mb-2">
          {title}
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          {subTitle}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DecisionHubTitleCard; 