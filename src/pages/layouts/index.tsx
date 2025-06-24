import React from 'react';
import { menuList } from './menu';
import * as AiIcons from 'react-icons/ai';
import { Button } from '@/components/components/ui/button';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { logoutUser } from '../auth/login';

export default function SidebarLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutPress = (url?: string) => {
    logoutUser()
    if (url) {
      navigate(url)
    }
  }

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 220,
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px 0',
          minHeight: '100vh',
        }}
      >
        <div>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontWeight: 'bold', fontSize: 28, letterSpacing: 2 }}>wizer</div>
          </div>
          {/* Menu Sections */}
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
                    const Icon = AiIcons[item.icon as keyof typeof AiIcons];
                    const isActive = location.pathname === item.route;
                    return (
                      <div
                        key={item.label}
                        onClick={() => navigate(item.route)}
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
                        <span>{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </nav>
        </div>
        {/* User Profile & Logout */}
        <div style={{ textAlign: 'center', padding: '0 0 12px 0' }}>
          <div style={{ marginBottom: 8 }}>
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="avatar"
              style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #fff', margin: '0 auto' }}
            />
            <div style={{ fontSize: 12, marginTop: 4 }}>Shib Willoughby</div>
          </div>
          <Button className={`text-white w-[200px] !border !border-white rounded-[3px] !h-10`} onClick={() => handleLogoutPress('/login')}>LOGOUT</Button>
        </div>
      </aside>
      {/* Main Content */}
      <main style={{ flex: 1, background: '#fff' }}>
        <Outlet />
      </main>
    </div>
  );
}
