import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Button } from '@/components/components/ui/button'
import { Label } from '@/components/components/ui/label'
import { Badge } from '@/components/components/ui/badge'
import { Toaster } from '@/components/components/ui/sonner'
import {
  getAllEducations,
  getAllEthnicities,
  getAllHobbiesOrInterests,
  getAllProfessions,
  getUserEducation,
  getUserEthnicities,
  getUserHobbiesOrInterests,
  getUserProfession,
  setUserEducation,
  setUserEthnicities,
  setUserHobbiesOrInterests,
  setUserProfession
} from '@/apis/profile'

interface BlankDiversityProps {
  setDisableSave: React.Dispatch<React.SetStateAction<boolean>>;
}
const BlankDiversity = forwardRef(({ setDisableSave }: BlankDiversityProps, ref) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [allEducations, setAllEducations] = useState<any[]>([])
  const [allProfessions, setAllProfessions] = useState<any[]>([])
  const [allEthnicities, setAllEthnicities] = useState<any[]>([])
  const [allHobbiesOrInterests, setAllHobbiesOrInterests] = useState<any[]>([])

  const [education, setEducation] = useState('')
  const [profession, setProfession] = useState('')
  const [ethnicities, setEthnicities] = useState<string[]>([])
  const [hobbiesOrInterests, setHobbiesOrInterests] = useState<string[]>([])

  const [isEducationSubmitted, setIsEducationSubmitted] = useState(false)
  const [isProfessionSubmitted, setIsProfessionSubmitted] = useState(false)
  const [isEthnicitiesSubmitted, setIsEthnicitiesSubmitted] = useState(false)
  const [isHobbiesOrInterestsSubmitted, setIsHobbiesOrInterestsSubmitted] = useState(false)

  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMsg(msg)
    setToastType(type)
    setTimeout(() => setToastMsg(null), 2000)
  }

  const handleChangeEthnicities = (value: string) => {
    let newEthnicities = ethnicities.includes(value)
      ? ethnicities.filter(e => e !== value)
      : [...ethnicities, value]
    if (newEthnicities.length <= 3) {
      setEthnicities(newEthnicities)
    } else {
      showToast('Only Select Max 3 Ethnicities', 'error')
    }
  }

  const handleChangeHobbiesOrInterests = (value: string) => {
    let newHobbies = hobbiesOrInterests.includes(value)
      ? hobbiesOrInterests.filter(h => h !== value)
      : [...hobbiesOrInterests, value]
    setHobbiesOrInterests(newHobbies)
  }

  const fetchAllEducations = async () => {
    const res = await getAllEducations()
    if (res && res.educations.length > 0) {
      setAllEducations(res.educations)
    } else {
      showToast('Unable to Fetch Education Details', 'error')
    }
  }
  const fetchUserEducation = async () => {
    const res = await getUserEducation()
    if (res && res.educations.length > 0) {
      setEducation(res.educations[0])
      setIsEducationSubmitted(true)
    }
  }
  const fetchAllProfessions = async () => {
    const res = await getAllProfessions()
    if (res && res.professions.length > 0) {
      setAllProfessions(res.professions)
    } else {
      showToast('Unable to Fetch Profession Details', 'error')
    }
  }
  const fetchUserProfession = async () => {
    const res = await getUserProfession()
    if (res && res.professions.length > 0) {
      setProfession(res.professions[0])
      setIsProfessionSubmitted(true)
    }
  }
  const fetchAllEthnicities = async () => {
    const res = await getAllEthnicities()
    if (res && res.ethnicities.length > 0) {
      setAllEthnicities(res.ethnicities)
    } else {
      showToast('Unable to Fetch Ethnicities', 'error')
    }
  }
  const fetchUserEthnicities = async () => {
    const res = await getUserEthnicities()
    if (res && res.ethnicities.length > 0) {
      setEthnicities(res.ethnicities)
      setIsEthnicitiesSubmitted(true)
    }
  }
  const fetchAllHobbiesOrInterests = async () => {
    const res = await getAllHobbiesOrInterests()
    if (res && res.hobbiesOrInterests.length > 0) {
      setAllHobbiesOrInterests(res.hobbiesOrInterests)
    } else {
      showToast('Unable to Fetch Hobbies/Interests', 'error')
    }
  }
  const fetchUserHobbiesOrInterests = async () => {
    const res = await getUserHobbiesOrInterests()
    if (res && res.hobbiesOrInterests.length > 0) {
      setHobbiesOrInterests(res.hobbiesOrInterests)
      setIsHobbiesOrInterestsSubmitted(true)
    }
  }

  useEffect(() => {
    fetchAllEducations()
    fetchAllProfessions()
    fetchAllEthnicities()
    fetchAllHobbiesOrInterests()
    fetchUserEducation()
    fetchUserProfession()
    fetchUserEthnicities()
    fetchUserHobbiesOrInterests()
    // eslint-disable-next-line
  }, [])

  const saveAllData = async () => {
    setLoading(true)
    const educationRes = await setUserEducation(education)
    const professionRes = await setUserProfession(profession)
    const ethnicitiesRes = await setUserEthnicities(ethnicities)
    const hobbiesOrInterestsRes = await setUserHobbiesOrInterests(hobbiesOrInterests)

    if (educationRes && professionRes && ethnicitiesRes && hobbiesOrInterestsRes) {
      showToast('Saved Data Successfully', 'success')
      if (education) setIsEducationSubmitted(true)
      if (profession) setIsProfessionSubmitted(true)
      if (ethnicities.length > 0) setIsEthnicitiesSubmitted(true)
      if (hobbiesOrInterests.length > 0) setIsHobbiesOrInterestsSubmitted(true)
    } else {
      showToast('Unable to save data', 'error')
    }
    setLoading(false)
  }
  useImperativeHandle(ref, () => ({
    saveAllData
  }))
  useEffect(() => {
    const isDisabled = education === '' || profession === '' || ethnicities.length === 0 || hobbiesOrInterests.length === 0;
    setDisableSave(isDisabled);
  }, [education, profession, ethnicities, hobbiesOrInterests, setDisableSave]);

  const disableSave =
    education === '' || profession === '' || ethnicities.length === 0 || hobbiesOrInterests.length === 0

  return (
    <div className="w-full flex justify-center">
      <Toaster />
      {toastMsg && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded shadow-lg text-white ${toastType === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>{toastMsg}</div>
      )}
      <div className="w-full max-w-xl bg-white rounded-lg shadow p-8">
        <div className="mb-8 text-center">
          {!isEducationSubmitted && (
            <div className="mb-4">
              <Label htmlFor="education-select">Education</Label>
              <select
                id="education-select"
                value={education}
                onChange={e => setEducation(e.target.value)}
                className={`w-full mt-2 p-2 border rounded ${education.length === 0 ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Please Select</option>
                {allEducations.map((education: any) => (
                  <option key={education.text} value={education.text}>{education.text}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="mb-8 text-center">
          {!isProfessionSubmitted && (
            <div className="mb-4">
              <Label htmlFor="profession-select">Profession</Label>
              <select
                id="profession-select"
                value={profession}
                onChange={e => setProfession(e.target.value)}
                className={`w-full mt-2 p-2 border rounded ${profession.length === 0 ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Please Select</option>
                {allProfessions.map((profession: any) => (
                  <option key={profession.text} value={profession.text}>{profession.text}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="mb-8 text-center">
          {!isEthnicitiesSubmitted && (
            <div className="mb-4">
              <Label>Ethnicities <span className="text-xs text-gray-400">(max 3)</span></Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {ethnicities.map((eth) => (
                  <Badge key={eth} variant="secondary">{eth}</Badge>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {allEthnicities.map((ethnicity: any) => (
                  <label key={ethnicity.text} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ethnicities.includes(ethnicity.text)}
                      onChange={() => handleChangeEthnicities(ethnicity.text)}
                      id={`ethnicity-${ethnicity.text}`}
                      className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                    />
                    <span>{ethnicity.text}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          {!isHobbiesOrInterestsSubmitted && (
            <div className="mb-4">
              <Label>Hobbies / Interests</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {hobbiesOrInterests.map((hobby) => (
                  <Badge key={hobby} variant="secondary">{hobby}</Badge>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {allHobbiesOrInterests.map((hobby: any) => (
                  <label key={hobby.text} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hobbiesOrInterests.includes(hobby.text)}
                      onChange={() => handleChangeHobbiesOrInterests(hobby.text)}
                      id={`hobby-${hobby.text}`}
                      className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                    />
                    <span>{hobby.text}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        {/*
        <div className="flex justify-center mt-8">
          <Button onClick={saveAllData} disabled={disableSave || loading}>
            {loading ? 'Saving...' : 'Submit'}
          </Button>
        </div>
        */}
      </div>
    </div>
  )
})

export default BlankDiversity
