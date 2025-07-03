import React, { useState } from 'react';
import { menuList } from './menu';
import { WizerIconMap, WizerToptIcon } from '@/components/icons';
import { Button } from '@/components/components/ui/button';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import { logoutUser } from '@/apis/auth';
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

const SidebarLayout: React.FC<SidebarLayoutProps & { user?: any }> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // --- ORG ID LOGIC ---
  // Compute if user has any valid org id
  let hasOrgId = false;
  if (props.user) {
    for (const key in props.user) {
      if (
        props.user[key] &&
        typeof props.user[key].organization_id !== 'undefined' &&
        props.user[key].organization_id !== 0
      ) {
        hasOrgId = true;
        break;
      }
    }
  }

  // If no org id and not on dashboard, redirect to dashboard
  React.useEffect(() => {
    if (!hasOrgId && location.pathname !== '/dashboard') {
      navigate('/dashboard', { replace: true });
    }
  }, [hasOrgId, location.pathname, navigate]);

  // Filter menu: only show Dashboard if no org id
  const filteredMenuList = !hasOrgId
    ? menuList.filter(section =>
        section.items.some(item => item.route === '/dashboard')
      ).map(section => ({
        ...section,
        items: section.items.filter(item => item.route === '/dashboard')
      }))
    : menuList;

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
    const checkMobile = () => setIsMobile(window.innerWidth < 1200);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Add scroll event listener
  React.useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      const scrollTop = target.scrollTop;
      setShowScrollTop(scrollTop > 300);
    };

    // Find the main element and attach scroll listener to it
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll);
      return () => mainElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

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
          className='fixed top-4 left-4 z-120 w-9 h-9 flex items-center justify-center bg-[#7b69af] rounded-8 box-shadow-[0_2px_8px_rgba(0,0,0,0.08)] cursor-pointer'
        >
          {/* Hamburger icon */}
          <div className='w-5 h-3 flex flex-col justify-between'>
            <div className='h-0.5 bg-[#fff] rounded-2' />
            <div className='h-0.5 bg-[#fff] rounded-2' />
            <div className='h-0.5 bg-[#fff] rounded-2' />
          </div>
        </div>
      )}

      {isMobile && isSidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className='fixed top-0 left-0 w-full h-full bg-black/35 z-110'
        />
      )}
      {/* Sidebar */}
      <aside
        className={`w-60 color-white flex flex-col justify-between pt-4 pb-1 h-screen bg-[#7b69af] box-shadow-[2px_0_16px_rgba(0,0,0,0.10)] transition-left duration-300 ${isMobile ? 'fixed z-[1000]' : 'fixed'} ${isMobile ? isSidebarOpen ? 'left-0' : 'left-[-260px]' : 'left-0'}`}
      >
        <div className='relative text-center mb-8'>
          <Link to="/dashboard">
            <div className='font-bold text-4xl tracking-2 text-white'>wizer</div>
          </Link>
          <div
            className='font-bold text-4xl tracking-2 text-white cursor-pointer'
            onClick={() => navigate('/dashboard')}
            role="button"
            tabIndex={0}
            onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') navigate('/dashboard'); }}
            aria-label="Go to dashboard"
          >
            wizer
          </div>
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
        <div className='h-[calc(100vh-100px)] overflow-y-auto'>
          <div style={{
            flex: 1,
            overflowY: 'auto',
            paddingRight: 4,
            marginBottom: 16,
          }} className="sidebar-menu-scroll">
            <nav>
              {filteredMenuList.map((section, sectionIdx) => {
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
                      const isActive = location.pathname.includes(item.route);
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
            <div className='text-white text-xs mt-1'>{props.userProfile?.name}</div>
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
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className='!h-10 !w-10'
          style={{
            position: 'fixed',
            bottom: 30,
            right: isMobile ? 30 : 50,
            zIndex: 1000,
            borderRadius: '50%',
            background: '#7b69af',
            color: '#fff',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.background = '#6a5a9e';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = '#7b69af';
          }}
        >
          <WizerToptIcon size={50} />
        </Button>
      )}
    </div>
  );
}

export default authRoute(SidebarLayout);