import React from 'react'
import AllPeople from '@/pages/all-people/all-people/'
import authRoute from '@/authentication/authRoute'

const AllPeoplePage: React.FC<any> = (props: any) => {
  return <AllPeople {...props} />
}

export default authRoute(AllPeoplePage)
