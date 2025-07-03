import authRoute from '@/authentication/authRoute'
import UserInfoMain from '@/pages/userinfo-from-popup/userInfo-form-popup'

const UserInfoFormPopup = (props: any) => {
  const { userProfile } = props

  return <UserInfoMain userProfile={userProfile} />
}

export default authRoute(UserInfoFormPopup)
