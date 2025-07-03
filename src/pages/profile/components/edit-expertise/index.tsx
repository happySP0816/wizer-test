/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { editCategories, getAllCategories, getCategories, getAllCategoriesByType } from '@/apis/profile'
import Loading from '@/components/loading'
import { toast } from "sonner"
import LoadingButton from '@/components/components/ui/loading-button'

interface Category {
  category: any
}

const EditExpertise: React.FC<any> = ({ categoryData, userProfile, user }) => {
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [allCategories, setAllCategories] = useState<Category[] | null>(null)
  const [userCategoriesIds, setUserCategoriesIds] = useState<number[]>([])

  const handleCategoryClick = (id: number) => {
    if (userCategoriesIds.includes(id)) {
      const ids = userCategoriesIds.filter(cid => cid !== id)
      setUserCategoriesIds(ids)
    } else {
      setUserCategoriesIds([...userCategoriesIds, id])
    }
  }

  const fetchAllCategories = async () => {
    setLoading(true)
    let res
    if (user.small_decision) {
      res = await getAllCategoriesByType()
    } else {
      res = await getAllCategories()
    }
    if (res) {
      setAllCategories(res)
    } else {
      toast.error('Unable to Fetch Categories')
    }
    setLoading(false)
  }

  const userId = userProfile.id

  const fetchUserCategoriesIds = async () => {
    const res = await getCategories(Number(userId))
    if (res) {
      const ids = res.map((item: Category) => item.category.id)
      setUserCategoriesIds(ids)
    } else {
      toast.error('Unable to Fetch Categories')
    }
  }

  const handleEditCategories = async () => {
    setSubmitLoading(true)
    const res = await editCategories(userCategoriesIds)
    if (res) {
      toast.success('Expertise Edit Successful')
    } else {
      toast.error('Unable to Edit Expertise')
    }
    setSubmitLoading(false)
  }

  useEffect(() => {
    fetchAllCategories()
    fetchUserCategoriesIds()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    categoryData(userCategoriesIds)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCategoriesIds])

  if (loading) {
    return <Loading />
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-lg shadow p-8">
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 my-8">
          {allCategories &&
            allCategories.map((category: any) => {
              const isActive = userCategoriesIds.includes(category.category.id)
              return (
                <div
                  key={category.category.id}
                  onClick={() => handleCategoryClick(category.category.id)}
                  className={`cursor-pointer rounded-lg border p-4 text-center transition-all select-none shadow-sm flex flex-col items-center justify-center gap-2
                      ${isActive ? 'border-primary bg-primary text-white' : 'border-gray-200 bg-white hover:border-primary'}
                    `}
                >
                  <div className="text-2xl">{category.category.icon}</div>
                  <div className="font-semibold text-sm">{category.category.title}</div>
                </div>
              )
            })}
        </div>
        <LoadingButton
          loading={submitLoading}
          loadingText='submitting...'
          className="w-full mt-6 flex items-center justify-center"
          onClick={handleEditCategories}
          disabled={submitLoading}
        >
          Submit
        </LoadingButton>
      </div>
    </div>
  )
}

export default EditExpertise
