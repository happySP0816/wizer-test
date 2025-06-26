import React, { useState } from 'react';
import { menuList } from './menu';
import { WizerIconMap } from '@/components/icons';
import { Button } from '@/components/components/ui/button';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { logoutUser } from '../auth/login';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/components/ui/avatar';
import authRoute from '@/authentication/authRoute';

interface UserProfileType {
  id: string
  name: string
  username: string
  image?: string
  bio?: string
  numberOfPosts: number
  numberOfFollowers: number
  numberOfFriends: number
  numberOfFollowing: number
}

interface SidebarLayoutProps {
  userProfile?: UserProfileType
}
const SidebarLayout: React.FC<SidebarLayoutProps> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const getAvatarName = (username: string | undefined): string => {
    if (!username) return ''
    const names = username.split(' ')
    if (names.length >= 2) {
      const initials = names.map(name => name.charAt(0)).join(' ')

      return initials.toUpperCase()
    }
    
    return names[0].charAt(0).toUpperCase()
  }

  const handleLogoutPress = (url?: string) => {
    logoutUser()
    if (url) {
      navigate(url)
    }
  }

  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getUserImageSrc = () => {
    if (!props.userProfile?.image) return ''

    if (props.userProfile?.image.includes('googleusercontent')) {
      return props.userProfile?.image
    } else {
      return `https://api.wizer.life/api/users/${props.userProfile?.image}`
    }
  }

  const userImageSrc = getUserImageSrc()

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', margin: 0, padding: 0, position: 'relative' }}>
      {isMobile && (
        <div
          onClick={() => setSidebarOpen(true)}
          style={{
            position: 'fixed',
            top: 20,
            left: 20,
            zIndex: 120,
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#7b69af',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            cursor: 'pointer',
          }}
        >
          {/* Hamburger icon */}
          <div style={{ width: 22, height: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ height: 3, background: '#fff', borderRadius: 2 }} />
            <div style={{ height: 3, background: '#fff', borderRadius: 2 }} />
            <div style={{ height: 3, background: '#fff', borderRadius: 2 }} />
          </div>
        </div>
      )}

      {isMobile && isSidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.35)',
            zIndex: 110,
          }}
        />
      )}
      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px 0',
          height: '100vh',
          position: isMobile ? 'fixed' : 'fixed',
          top: 0,
          left: isMobile ? (isSidebarOpen ? 0 : -260) : 0,
          zIndex: 130,
          background: '#7b69af',
          boxShadow: isMobile && isSidebarOpen ? '2px 0 16px rgba(0,0,0,0.10)' : '2px 0 16px rgba(0,0,0,0.10)',
          transition: 'left 0.3s',
        }}
      >

        <div>
          <div className='relative text-center mb-8'>
            <div style={{ fontWeight: 'bold', fontSize: 28, letterSpacing: 2 }}>wizer</div>
            {isMobile && (
              <div className='absolute right-4 top-1'>
                <Button
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close menu"
                  className='focus:!border-none focus:!outline-none text-3xl'
                >
                  &times;
                </Button>
              </div>
            )}
          </div>

          <div style={{
            flex: 1,
            overflowY: 'auto',
            paddingRight: 4,
            marginBottom: 16,
          }} className="sidebar-menu-scroll">
            <nav>
              {menuList.map((section, sectionIdx) => {
                const isCommunity = section.section === 'COMMUNITY';
                return (
                  <div key={section.section} style={{
                    marginBottom: sectionIdx === menuList.length - 1 ? 0 : 24,
                    ...(isCommunity ? {
                      marginTop: 32,
                      marginLeft: 0,
                      marginRight: 0,
                      padding: 0,
                    } : {})
                  }}>
                    <div style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 1,
                      color: '#fff',
                      opacity: 0.7,
                      margin: isCommunity ? '0 0 10px 24px' : '0 0 10px 24px',
                    }}>{section.section}</div>
                    {section.items.map((item) => {
                      const Icon = WizerIconMap[item.icon];
                      const isActive = location.pathname === item.route;
                      return (
                        <div
                          key={item.label}
                          onClick={() => {
                            navigate(item.route);
                            if (isMobile) setSidebarOpen(false);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '10px 24px',
                            background: isActive ? '#fff' : 'transparent',
                            color: isActive ? '#7b69af' : '#fff',
                            borderRadius: 6,
                            marginBottom: 4,
                            marginLeft: 12,
                            marginRight: 12,
                            cursor: 'pointer',
                            fontWeight: isActive ? 600 : 400,
                            transition: 'background 0.2s, color 0.2s'
                          }}
                        >
                          {Icon && <Icon size={20} style={{ marginRight: 16 }} />}
                          <span className="sidebar-label">{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        <div className='flex-none' style={{ textAlign: 'center', padding: '0 0 12px 0', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 'auto' }}>
          <div style={{ marginBottom: 8, paddingTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
              <Avatar 
                className='feedUserImage w-10 h-10'
              >
                <AvatarImage src={userImageSrc} alt="@shadcn" />
                <AvatarFallback>
                  {getAvatarName(props.userProfile?.name)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div style={{ fontSize: 12, marginTop: 4 }}>{props.userProfile?.name}</div>
          </div>
          <Button className={`text-white w-[200px] !border !border-white rounded-[3px] !h-10`} onClick={() => handleLogoutPress('/login')}>LOGOUT</Button>
        </div>
      </aside>
      <main style={{ 
        flex: 1, 
        background: '#fff', 
        minHeight: '100vh',
        marginLeft: isMobile ? 0 : 240,
        overflowY: 'auto',
        width: isMobile ? '100%' : 'calc(100vw - 240px)'
      }}>
        <Outlet />
      </main>
    </div>
  );
}

export default authRoute(SidebarLayout);