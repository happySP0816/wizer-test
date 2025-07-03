import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/components/ui/avatar'
import { WizerProfileEditIcon } from '@/components/icons'

interface UserProfileProps {
  image?: string
  name: string
  bio?: string
  hideEditBtn?: boolean
}


const UserProfile: React.FC<UserProfileProps> = ({ image, name, bio, hideEditBtn }) => {
  
  const getAvatarName = (username: string | undefined): string => {
    if (!username) return ''
    const names = username.split(' ')
    if (names.length >= 2) {
      const initials = names.map(name => name.charAt(0)).join(' ')

      return initials.toUpperCase()
    }
    
    return names[0].charAt(0).toUpperCase()
  }
  const getUserImageSrc = () => {
    if (!image) return ''

    if (image.includes('googleusercontent')) {
      return image
    } else {
      return `https://api.wizer.life/api/users/${image}`
    }
  }
  const userImageSrc = getUserImageSrc()
  
  return (
    <Card className="border-0 shadow-none">
      <CardContent className='p-0'>
        <div className='flex flex-col'>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className='flex items-center justify-center mb-0.5' >
                <Avatar className='w-[72px] h-[72px]'>
                  <AvatarImage src={userImageSrc} alt="@shadcn" />
                  <AvatarFallback>
                    {getAvatarName(name)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            {!hideEditBtn && (
              <div className='absolute top-2.5 right-3.5'>
                <Link to='/profile'>
                  <WizerProfileEditIcon size={24} style={{color: '#7B69AF'}} />
                </Link>
              </div>
            )}
          </div>
          <div className='text-xl font-semibold mb-0.5 text-black text-center'>{name}</div>
          <div className='text-sx font-normal text-black text-center'>{bio || 'Not available'}</div>
        </div>
      </CardContent>
    </Card>
  )
}

export default UserProfile 