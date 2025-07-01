import React from 'react'
import Integration from '@/pages/integrations/screens'; 
import authRoute from '@/authentication/authRoute'

interface userProfileprops {
  id: number;
}

interface slackintegrationProps {
    code: string
    userProfile: userProfileprops
  }

const IntegrationsPage: React.FC<slackintegrationProps> = ({ code, userProfile }: { code: string, userProfile: userProfileprops })  => {
 
  const titleStyle = {
    margin: 'auto',
    textAlign: 'center',
    fontSize: 22
  }

  return (
    
    <Integration code={code} userProfile={userProfile} />
  
  )
} 
export async function getServerSideProps({ query, res }: { query: { code: string, state: string }, res: any }) {
  
    const { code, state } = query;
   
     if (!code || code === null ) {
        return {
          // Return an empty object if the code property is not set or is null.
          props: {},
        };
      }
    
    return { props: { code  } };
  }

export default authRoute(IntegrationsPage)
