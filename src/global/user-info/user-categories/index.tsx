import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/components/ui/card'
import { getUserCategories } from '@/apis/user-profile'
import { getUserEndorsed } from '@/apis/post'
import { Typography } from '@/components/components/ui/typography'

interface Category {
  icon: string
  title: string
}

interface UserCategory {
  category: Category
  id: number
}
interface UserCategoriesProps {
  userId: string
  hideEditBtn?: boolean
}

const UserCategories: React.FC<UserCategoriesProps> = ({ userId }) => {
  const [userCategories, setUserCategories] = useState<UserCategory[]>([])
  const [endorsedCategory, setEndorsedCategory] = useState<any>(null)

  const userCategory = userId

  const handleUserCategories = async () => {
    try {
      const response = await getUserCategories(userCategory)
      const filteredCategories = response.filter((category: any) => {
        
        return category.category.id > 30; 
      });

      if (filteredCategories.length > 0) {
        setUserCategories(filteredCategories);
      } else {
        setUserCategories(response);
      }
    } catch (error) {
      console.error('Error fetching user categories:', error)
    }
  }
  const fetchEndorsedCategory = async () => {
    try {
      const res = await getUserEndorsed(userId)
      setEndorsedCategory(res)
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }
  useEffect(() => {
    handleUserCategories()
    fetchEndorsedCategory()
  }, [])

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-2">
        <div className="flex flex-wrap gap-2">
          {userCategories.length > 0 && (
            userCategories?.slice(0, 3)?.map((category, idx) => (
              <div key={`user-${category.id ?? idx}`} className='px-4 py-[7.5px] bg-[#42346B] rounded-4xl'>
                <span>{category.category.icon}</span>
                <Typography className='text-[10px] font-semibold text-white'>{category.category.title}</Typography>
              </div>
            ))
          )}
          {endorsedCategory?.length > 0 && (
            endorsedCategory?.slice(0, 3)?.map((category: any, idx: number) => (
              <div key={`endorsed-${category.id ?? idx}`} className=''>
                <span>{category.category.icon}</span>
                <Typography className='text-[10px] font-semibold text-white'>{category.category.title}</Typography>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default UserCategories 