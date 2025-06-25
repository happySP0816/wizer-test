import React from 'react'
import { Card, CardContent } from '@/components/components/ui/card'
import { Typography } from '@/components/components/ui/typography'

interface UserCategoriesProps {
  userId: string
}

const UserCategories: React.FC<UserCategoriesProps> = ({ userId }) => {
  // Mock categories - in real app, fetch from API
  const categories = [
    { id: '1', name: 'Technology', color: '#3B82F6' },
    { id: '2', name: 'Business', color: '#10B981' },
    { id: '3', name: 'Design', color: '#F59E0B' },
  ]

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <span
              key={category.id}
              className="px-3 py-1 text-xs font-medium rounded-full"
              style={{
                backgroundColor: `${category.color}20`,
                color: category.color,
                border: `1px solid ${category.color}40`
              }}
            >
              {category.name}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default UserCategories 