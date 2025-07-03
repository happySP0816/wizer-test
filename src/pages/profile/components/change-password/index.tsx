import React, { useState } from 'react'
import { editPassword } from '@/apis/profile'
import { Input } from '@/components/components/ui/input'
import { Button } from '@/components/components/ui/button'
import { Label } from '@/components/components/ui/label'
import { Progress } from '@/components/components/ui/progress'
import { Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import LoadingButton from '@/components/components/ui/loading-button'

interface ChangePasswordProps {
  email: string
}

const ChangePassword: React.FC<ChangePasswordProps> = (userProfile) => {
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newConfirmPassword, setNewConfirmPassword] = useState('')

  const [newPasswordError, setNewPasswordError] = useState(false)
  const [newConfirmPasswordError, setNewConfirmPasswordError] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showNewConfirmPassword, setShowNewConfirmPassword] = useState(false)

  const email = userProfile.email

  const validateNewPassword = () => {
    if (newPassword.length < 8) {
      setNewPasswordError(true)
    } else {
      setNewPasswordError(false)
    }
    validateNewConfirmPassword()
  }
  const validateNewConfirmPassword = () => {
    if (newPassword !== newConfirmPassword) {
      setNewConfirmPasswordError(true)
    } else {
      setNewConfirmPasswordError(false)
    }
  }

  const handlePasswordSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    if (!newConfirmPasswordError) {
      const res = await editPassword(password, newPassword)
      if (res.result) {
        toast.success('Password Change Successful')
      } else if (res.error?.errorCode === 303) {
        toast.error('Please Type Valid Old Password')
      } else {
        toast.error('Unable to Change Password')
      }
    } else {
      toast.error('Password does not match')
    }
    setLoading(false)
  }

  // Password strength calculation
  function getPasswordStrength(pw: string) {
    let score = 0;
    if (pw.length >= 8) score += 1;
    if (/[A-Z]/.test(pw)) score += 1;
    if (/[a-z]/.test(pw)) score += 1;
    if (/\d/.test(pw)) score += 1;
    if (/[^A-Za-z0-9]/.test(pw)) score += 1;
    return score;
  }
  const passwordStrength = getPasswordStrength(newPassword);
  const progressValue = (passwordStrength / 5) * 100;
  const progressColor =
    passwordStrength <= 2 ? 'bg-red-500' :
      passwordStrength === 3 ? 'bg-yellow-500' :
        passwordStrength === 4 ? 'bg-blue-500' :
          'bg-green-500';

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow p-8">
      <form className="space-y-6" onSubmit={handlePasswordSave}>
        <div>
          <Label htmlFor="current-password">Current password</Label>
          <div className="relative">
            <Input
              id="current-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="pr-10 mt-1"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"
              onClick={() => setShowPassword(show => !show)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-1 text-left">
            Required if you want to change the Email address or Password below.
          </div>
        </div>
        <div>
          <Label htmlFor="new-password">New Password</Label>
          <div className="relative">
            <Input
              id="new-password"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              onBlur={validateNewPassword}
              className="pr-10 mt-1"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"
              onClick={() => setShowNewPassword(show => !show)}
              tabIndex={-1}
            >
              {showNewPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
          <div className="mt-2">
            <Progress value={progressValue} className={progressColor} />
            <div className="text-xs mt-1">
              {passwordStrength <= 2 && 'Weak'}
              {passwordStrength === 3 && 'Medium'}
              {passwordStrength === 4 && 'Strong'}
              {passwordStrength === 5 && 'Very Strong'}
            </div>
          </div>
          {newPasswordError && (
            <div className="text-xs text-red-500 mt-1 text-left">
              Field must be at least 8 characters long
            </div>
          )}
        </div>
        <div>
          <Label htmlFor="confirm-password">Confirm New Password</Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showNewConfirmPassword ? 'text' : 'password'}
              value={newConfirmPassword}
              onChange={e => setNewConfirmPassword(e.target.value)}
              onBlur={validateNewConfirmPassword}
              className="pr-10 mt-1"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"
              onClick={() => setShowNewConfirmPassword(show => !show)}
              tabIndex={-1}
            >
              {showNewConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
          {newConfirmPasswordError && (
            <div className="text-xs text-red-500 mt-1 text-left">
              Password does not match
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1 text-left">
            To change the current user password, enter the new password in both fields.
          </div>
        </div>
        <LoadingButton
          loading={loading}
          loadingText='submitting...'
          type="submit"
          className="w-full mt-6"
          disabled={loading || newPassword !== newConfirmPassword || newPassword.length < 8}
        >
          Submit
        </LoadingButton>
      </form>
    </div>
  )
}

export default ChangePassword
