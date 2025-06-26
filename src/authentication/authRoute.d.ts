import { ComponentType } from 'react'

interface AuthRouteProps {
  user?: any
  authenticated?: boolean
  userProfile?: any
}

declare const authRoute: <P extends AuthRouteProps>(
  Component: ComponentType<P>
) => ComponentType<Omit<P, keyof AuthRouteProps>>

export default authRoute 