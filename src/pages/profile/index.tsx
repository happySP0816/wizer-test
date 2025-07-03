import authRoute from 'src/authentication/authRoute'
import { type FC, useState, useEffect } from 'react'
import EditExpertise from './components/edit-expertise'
import EditDiversity from './components/edit-diversity'
import EditUserDetails from './components/edit-user-detail'
import EditPersonality from './components/edit-personality'
import ChangePassword from './components/change-password'
import { useLocation } from 'react-router-dom'
import { Typography } from '@/components/components/ui/typography'
import { Button } from '@/components/components/ui/button'

const Profile: FC<any> = (props) => {
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const status = params.get('status')
    const isStatusFalse = status === 'false'

    const [activeSection, setActiveSection] = useState('Edit Profile')
    const [, setUserDetailsError] = useState(false)
    const [, setCategoryError] = useState(false)
    const [, setPersonalityError] = useState(false)
    const [, setDiversityError] = useState(false)

    useEffect(() => {
        if (status) {
            setActiveSection(String(status))
        }
    }, [status])

    const handleUserDetailsChange = (data: any) => {
        if (!data?.firstName || !data?.lastName || !data?.bio || !data?.gender || !data?.location) {
            setUserDetailsError(true)
        } else {
            setUserDetailsError(false)
        }
    }

    const handleCategoryData = (data: any) => {
        if (isStatusFalse && !data) {
            setCategoryError(true)
        } else {
            setCategoryError(false)
        }
    }
    const handlePersonalityData = (data: any) => {
        if (isStatusFalse && !data) {
            setPersonalityError(true)
        } else {
            setPersonalityError(false)
        }
    }

    const handleDiversityData = (data: any) => {

        if (
            !data ||
            data.education === '' ||
            data.profession === '' ||
            data.ethnicities.length === 0 ||
            data.hobbiesOrInterests?.length === 0
        ) {
            setDiversityError(true)
        } else {
            setDiversityError(false)
        }
    }

    return (
        <div className="!h-screen p-[30px] flex flex-col gap-8">
            <div className="flex items-center justify-between flex-none">
                <div className='flex items-center justify-center'>
                    <Typography className="flex items-center text-4xl font-bold">
                        Edit User Detail
                    </Typography>
                </div>
            </div>
            <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6 relative">
                    <aside className="md:w-1/4 w-full flex-none">
                        <div className="flex flex-col gap-2 w-full items-start sticky top-2">
                            <Button
                                type="button"
                                className={`items-start h-[47px] w-full cursor-pointer px-4 text-sm rounded-none rounded-t-xs font-medium transition-colors duration-700 flex justify-start gap-3 ${activeSection === 'Edit Profile' ? 'bg-primary text-white font-semibold border' : 'bg-gray-200 text-gray-700'} hover:!text-white focus:!outline-none`}
                                onClick={() => setActiveSection('Edit Profile')}
                            >
                                <img src="/images/icons96.png" alt="Edit Profile" className={`w-6 h-6 ${activeSection === 'Edit Profile' ? 'filter brightness-0 invert' : ''}`} />
                                <span className="pl-2 text-base font-medium">Edit Profile</span>
                            </Button>
                            <Button
                                type="button"
                                className={`items-start h-[47px] w-full cursor-pointer px-4 text-sm rounded-none rounded-t-xs font-medium transition-colors duration-700 flex justify-start gap-3 ${activeSection === 'Edit Expertise' ? 'bg-primary text-white font-semibold border' : 'bg-gray-200 text-gray-700'} hover:!text-white focus:!outline-none`}
                                onClick={() => setActiveSection('Edit Expertise')}
                            >
                                <img src="/images/expert96.png" alt="Edit Expertise" className={`w-6 h-6 ${activeSection === 'Edit Expertise' ? 'filter brightness-0 invert' : ''}`} />
                                <span className="pl-2 text-base font-medium">Edit Expertise</span>
                            </Button>
                            <Button
                                type="button"
                                className={`items-start h-[47px] w-full cursor-pointer px-4 text-sm rounded-none rounded-t-xs font-medium transition-colors duration-700 flex justify-start gap-3 ${activeSection === 'Edit Personality' ? 'bg-primary text-white font-semibold border' : 'bg-gray-200 text-gray-700'} hover:!text-white focus:!outline-none`}
                                onClick={() => setActiveSection('Edit Personality')}
                            >
                                <img src="/images/personality.png" alt="Edit Personality" className={`w-6 h-6 ${activeSection === 'Edit Personality' ? 'filter brightness-0 invert' : ''}`} />
                                <span className="pl-2 text-base font-medium">Edit Personality</span>
                            </Button>
                            <Button
                                type="button"
                                className={`items-start h-[47px] w-full cursor-pointer px-4 text-sm rounded-none rounded-t-xs font-medium transition-colors duration-700 flex justify-start gap-3 ${activeSection === 'Edit Diversity' ? 'bg-primary text-white font-semibold border' : 'bg-gray-200 text-gray-700'} hover:!text-white focus:!outline-none`}
                                onClick={() => setActiveSection('Edit Diversity')}
                            >
                                <img src="/images/diversity10.png" alt="Edit Diversity" className={`w-6 h-6 ${activeSection === 'Edit Diversity' ? 'filter brightness-0 invert' : ''}`} />
                                <span className="pl-2 text-base font-medium">Edit Diversity</span>
                            </Button>
                            <Button
                                type="button"
                                className={`items-start h-[47px] w-full cursor-pointer px-4 text-sm rounded-none rounded-t-xs font-medium transition-colors duration-700 flex justify-start gap-3 ${activeSection === 'Change Password' ? 'bg-primary text-white font-semibold border' : 'bg-gray-200 text-gray-700'} hover:!text-white focus:!outline-none`}
                                onClick={() => setActiveSection('Change Password')}
                            >
                                <img src="/images/changepassword96.png" alt="Change Password" className={`w-6 h-6 ${activeSection === 'Change Password' ? 'filter brightness-0 invert' : ''}`} />
                                <span className="pl-2 text-base font-medium">Change Password</span>
                            </Button>
                        </div>
                    </aside>
                    <section className="flex-1">
                        {activeSection === 'Edit Profile' && (
                            <EditUserDetails onUserDataChange={handleUserDetailsChange} userProfile={props.userProfile} />
                        )}
                        {activeSection === 'Edit Expertise' && (
                            <EditExpertise categoryData={handleCategoryData} userProfile={props.userProfile} user={props.user} />
                        )}
                        {activeSection === 'Edit Personality' && (
                            <EditPersonality expertiseData={handlePersonalityData} />
                        )}
                        {activeSection === 'Edit Diversity' && (
                            <EditDiversity diversityData={handleDiversityData} />
                        )}
                        {activeSection === 'Change Password' && (
                            <ChangePassword {...props.userProfile} />
                        )}
                    </section>
                </div>
            </div>
        </div>
    )
}

export default authRoute(Profile)
