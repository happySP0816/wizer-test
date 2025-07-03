import React, { useEffect, useState } from 'react'
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
import { Label } from '@/components/components/ui/label'
import { Checkbox } from '@/components/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/components/ui/select'
import Loading from '@/components/loading'
import { toast } from "sonner"
import LoadingButton from '@/components/components/ui/loading-button'

const EditDiversity: React.FC<any> = ({ diversityData }) => {
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const [allEducations, setAllEducations] = useState<any[]>([])
  const [allProfessions, setAllProfessions] = useState<any[]>([])
  const [allEthnicities, setAllEthnicities] = useState<any[]>([])
  const [allHobbiesOrInterests, setAllHobbiesOrInterests] = useState<any[]>([])

  const [education, setEducation] = useState('')
  const [profession, setProfession] = useState('')
  const [ethnicities, setEthnicities] = useState<string[]>([])
  const [hobbiesOrIntersts, setHobbiesOrIntersts] = useState<string[]>([])

  const isStatusFalse = false 

  const fetchAllEducations = async () => {
    const res = await getAllEducations()
    if (res && res.educations.length > 0) {
      setAllEducations(res.educations)
    } else {
      toast.error('Unable to Fetch Details')
    }
  }
  const fetchUserEducation = async () => {
    const res = await getUserEducation()
    if (res && res.educations.length > 0) {
      setEducation(res.educations[0])
    }
  }
  const fetchAllProfessions = async () => {
    const res = await getAllProfessions()
    if (res && res.professions.length > 0) {
      setAllProfessions(res.professions)
    } else {
      toast.error('Unable to Fetch Details')
    }
  }
  const fetchUserProfession = async () => {
    const res = await getUserProfession()
    if (res && res.professions.length > 0) {
      setProfession(res.professions[0])
    }
  }
  const fetchAllEthnicities = async () => {
    const res = await getAllEthnicities()
    if (res && res.ethnicities.length > 0) {
      setAllEthnicities(res.ethnicities)
    } else {
      toast.error('Unable to Fetch Details')
    }
  }
  const fetchUserEthnicities = async () => {
    const res = await getUserEthnicities()
    if (res && res.ethnicities.length > 0) {
      setEthnicities(res.ethnicities)
    }
  }
  const fetchAllHobbiesOrInterests = async () => {
    const res = await getAllHobbiesOrInterests()
    if (res && res.hobbiesOrInterests.length > 0) {
      setAllHobbiesOrInterests(res.hobbiesOrInterests)
    } else {
      toast.error('Unable to Fetch Details')
    }
  }
  const fetchUserHobbiesOrInterests = async () => {
    const res = await getUserHobbiesOrInterests()
    if (res && res.hobbiesOrInterests.length > 0) {
      setHobbiesOrIntersts(res.hobbiesOrInterests)
    }
  }

  useEffect(() => {
    const getAllData = async () => {
      setLoading(true)
      await fetchAllEducations()
      await fetchAllProfessions()
      await fetchAllEthnicities()
      await fetchAllHobbiesOrInterests()
      await fetchUserEducation()
      await fetchUserProfession()
      await fetchUserEthnicities()
      await fetchUserHobbiesOrInterests()
      setLoading(false)
    }
    getAllData()
  }, [])

  const handleChangeEthnicities = (value: string) => {
    let newEthnicities = ethnicities.includes(value)
      ? ethnicities.filter(e => e !== value)
      : [...ethnicities, value]
    if (newEthnicities.length <= 3) {
      setEthnicities(newEthnicities)
    } else {
      toast.error('Only Select Max 3 Ethnicities')
    }
  }
  const handleChangeHobbiesOrInterests = (value: string) => {
    let newHobbies = hobbiesOrIntersts.includes(value)
      ? hobbiesOrIntersts.filter(h => h !== value)
      : [...hobbiesOrIntersts, value]
    setHobbiesOrIntersts(newHobbies)
  }

  const saveAllData = async () => {
    setSubmitLoading(true)
    const educationRes = await setUserEducation(education)
    const professionRes = await setUserProfession(profession)
    const ethnicitiesRes = await setUserEthnicities(ethnicities)
    const hobbiesOrInterestsRes = await setUserHobbiesOrInterests(hobbiesOrIntersts)
    if (educationRes && professionRes && ethnicitiesRes && hobbiesOrInterestsRes) {
      toast.success('Saved Data Successfully')
    } else {
      toast.error('Unable to save data')
    }
    setSubmitLoading(false)
  }

  const disableSave =
    education === '' || profession === '' || ethnicities.length === 0 || hobbiesOrIntersts.length === 0

  useEffect(() => {
    if (isStatusFalse) {
      const userData = {
        education: education,
        profession: profession,
        ethnicities: ethnicities,
        hobbiesOrIntersts: hobbiesOrIntersts
      }
      diversityData(userData)
    }
  }, [education, profession, ethnicities, hobbiesOrIntersts])


  if (loading) {
    return <Loading />
  }


  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-lg shadow p-8">
      <form className="space-y-6" onSubmit={e => { e.preventDefault(); saveAllData(); }}>
        <div>
          <Label htmlFor="education">Education</Label>
          <Select value={education} onValueChange={setEducation}>
            <SelectTrigger id="education" className="w-full mt-1">
              <SelectValue placeholder="Please Select" />
            </SelectTrigger>
            <SelectContent>
              {allEducations.map(education => (
                <SelectItem key={education.text} value={education.text}>
                  {education.icon} {education.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {education.length === 0 && isStatusFalse && (
            <div className="text-xs text-red-500 mt-1 text-left">Education is required</div>
          )}
        </div>
        <div>
          <Label htmlFor="profession">Profession</Label>
          <Select value={profession} onValueChange={setProfession}>
            <SelectTrigger id="profession" className="w-full mt-1">
              <SelectValue placeholder="Please Select" />
            </SelectTrigger>
            <SelectContent>
              {allProfessions.map(profession => (
                <SelectItem key={profession.text} value={profession.text}>
                  {profession.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {profession.length === 0 && isStatusFalse && (
            <div className="text-xs text-red-500 mt-1 text-left">Profession is required</div>
          )}
        </div>
        <div>
          <Label>Ethnicities (max 3)</Label>
          {ethnicities.length === 0 && isStatusFalse && (
            <div className="text-xs text-red-500 mt-1 text-left">At least one ethnicity is required</div>
          )}
          <div className="grid grid-cols-2 gap-2 mt-2">
            {allEthnicities.map(ethnicity => (
              <label key={ethnicity.text} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={ethnicities.includes(ethnicity.text)}
                  onCheckedChange={() => handleChangeEthnicities(ethnicity.text)}
                />
                <span>{ethnicity.text}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <Label>Hobbies / Interests</Label>
          {hobbiesOrIntersts.length === 0 && isStatusFalse && (
            <div className="text-xs text-red-500 mt-1 text-left">At least one hobby/interest is required</div>
          )}
          <div className="grid grid-cols-4 gap-2 mt-2">
            {allHobbiesOrInterests.map(hobby => (
              <label key={hobby.text} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={hobbiesOrIntersts.includes(hobby.text)}
                  onCheckedChange={() => handleChangeHobbiesOrInterests(hobby.text)}
                />
                <span>{hobby.text}</span>
              </label>
            ))}
          </div>
        </div>
        <LoadingButton
          type="submit"
          className="w-full mt-6"
          loading={submitLoading}
          loadingText="Submitting..."
          disabled={disableSave || loading || submitLoading}
        >
          Submit
        </LoadingButton>
      </form>
    </div>
  )
}

export default EditDiversity
