import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/components/ui/button"
import { Input } from "@/components/components/ui/input";
import { signIn } from "@/apis/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const ResetPass = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [email] = useState('');
    const [password, setPassword] = useState('');
    const [, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const [redirect, setRedirect]  = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const isLoginFormValid = email.trim() !== '' && password.trim() !== '';
    const searchParams = new URLSearchParams(location.search);
    const redirectTo = searchParams.get('redirectTo') ? decodeURIComponent(searchParams.get('redirectTo') as string) : '/dashboard';
    
    useEffect(() => {
        // Fetch token from session storage
        const storedToken = sessionStorage.getItem('token')
        setToken(storedToken)
        if (storedToken) {
            navigate(redirectTo, { replace: true }) // Use replace to avoid double redirects
        } else {
            setToken(storedToken)
            setRedirect(redirectTo)
        }
    }, [])

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value)
      setPasswordError('')
    }

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    
        const payload = { email, password }
    
        try {
          const response = await signIn(payload)
          if (response.error) {
            const { error } = response
            if (error.message === 'email, password') {
              setEmailError('Please enter a valid email')
              setPasswordError('Please enter a valid password')
            } else if (error.message === 'password') {
              setEmailError('')
              setPasswordError('Password does not match')
            } else if (error.errorCode === 216) {
              setEmailError('Recheck your email')
              setPasswordError('Recheck your password')
            }
          }
          if (response.tokens) {
            toast.success('Login successful! Redirecting to dashboard...', {
              duration: 3000,
              position: 'top-right',
              icon: '🔑',
              style: {
                backgroundColor: '#000',
                color: '#fff',
              },
            });
            if (redirect) {
              navigate(redirect);
            }
          }
        } catch (error) {
          console.error('An error occurred:', error)
        }
    }
    if (!token) {
        return (
            <div className="flex flex-col items-center justify-center w-full gap-7">
                <div className="flex flex-col items-center justify-center w-[250px] gap-24">
                    <svg preserveAspectRatio="xMidYMid meet" data-bbox="0 0 360 70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 70" height="15.56" width="80" data-type="color" role="presentation" aria-hidden="true" aria-label="">
                        <g>
                            <path fill="#ffffff" d="M0 2.059h30.856l7.817 30.882L46.49 2.06h23.999l7.816 30.882L86.123 2.06h30.856L94.488 67.94H66.923l-8.502-29.51-8.366 29.51H22.491z" data-color="1"></path>
                            <path fill="#ffffff" d="M120.244 2.059H151.1V67.94h-30.856z" data-color="1"></path>
                            <path fill="#ffffff" d="m154.221 52.431 27.564-30.058h-26.878V2.058h68.843V17.43l-27.291 30.196h28.388V67.94h-70.626z" data-color="1"></path>
                            <path fill="#ffffff" d="M267.76 70q-20.297 0-31.679-9.059-11.245-9.059-11.245-25.666 0-16.334 10.148-25.804Q245.269 0 264.469 0q12.205 0 20.845 4.53 8.776 4.529 13.165 12.352 4.525 7.824 4.525 17.569v8.922h-48.821q3.978 7.137 17.965 7.137 6.446 0 13.44-.961 7.131-1.098 12.068-3.02v18.53q-5.486 2.196-13.577 3.568Q276.126 70 267.76 70m6.171-43.51q-1.646-6.862-10.011-6.862-8.091 0-9.737 6.862z" data-color="1"></path>
                            <path fill="#ffffff" d="M305.694 2.059h29.758V7.96q3.84-3.569 10.423-5.765Q352.457 0 360 0v23.882q-8.09 0-14.674 2.196-6.445 2.06-8.777 5.902v35.961h-30.855z" data-color="1"></path>
                        </g>
                    </svg>
                    <div className="flex flex-col items-center justify-center w-[250px] gap-4">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24 48C20.68 48 17.56 47.37 14.64 46.11C11.72 44.85 9.18 43.14 7.02 40.98C4.86 38.82 3.15 36.28 1.89 33.36C0.63 30.44 0 27.32 0 24H4.8C4.8 26.64 5.3 29.13 6.3 31.47C7.3 33.81 8.67 35.85 10.41 37.59C12.15 39.33 14.19 40.71 16.53 41.73C18.87 42.75 21.36 43.26 24 43.26C29.36 43.26 33.9 41.4 37.62 37.68C41.34 33.96 43.2 29.42 43.2 24.06C43.2 18.7 41.34 14.16 37.62 10.44C33.9 6.72 29.36 4.86 24 4.86C20.44 4.86 17.21 5.73 14.31 7.47C11.41 9.21 9.12 11.52 7.44 14.4H14.4V19.2H0V4.8H4.8V9.6C7 6.68 9.76 4.35 13.08 2.61C16.4 0.87 20.04 0 24 0C27.32 0 30.44 0.63 33.36 1.89C36.28 3.15 38.82 4.86 40.98 7.02C43.14 9.18 44.85 11.72 46.11 14.64C47.37 17.56 48 20.68 48 24C48 27.32 47.37 30.44 46.11 33.36C44.85 36.28 43.14 38.82 40.98 40.98C38.82 43.14 36.28 44.85 33.36 46.11C30.44 47.37 27.32 48 24 48ZM19.2 33.6C18.52 33.6 17.95 33.37 17.49 32.91C17.03 32.45 16.8 31.88 16.8 31.2V24C16.8 23.32 17.03 22.75 17.49 22.29C17.95 21.83 18.52 21.6 19.2 21.6V19.2C19.2 17.88 19.67 16.75 20.61 15.81C21.55 14.87 22.68 14.4 24 14.4C25.32 14.4 26.45 14.87 27.39 15.81C28.33 16.75 28.8 17.88 28.8 19.2V21.6C29.48 21.6 30.05 21.83 30.51 22.29C30.97 22.75 31.2 23.32 31.2 24V31.2C31.2 31.88 30.97 32.45 30.51 32.91C30.05 33.37 29.48 33.6 28.8 33.6H19.2ZM21.6 21.6H26.4V19.2C26.4 18.52 26.17 17.95 25.71 17.49C25.25 17.03 24.68 16.8 24 16.8C23.32 16.8 22.75 17.03 22.29 17.49C21.83 17.95 21.6 18.52 21.6 19.2V21.6Z" fill="white"/>
                        </svg>
                        <p className="text-white font-bold text-xl">Reset Password</p>
                    </div>
                </div>
                <form onSubmit={handleFormSubmit} className="flex flex-col items-center justify-center w-full gap-[30px]">
                    <div className="flex flex-col items-center justify-center w-[250px] gap-3">
                        <div className="relative w-full">
                            <Input 
                                className="text-white !h-10 !rounded-[3px] pr-10" 
                                placeholder="Enter your new password" 
                                type={showPassword ? "text" : "password"}
                                value={password} 
                                onChange={handlePasswordChange} 
                                helperText={passwordError}
                            />
                            <Button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 !bg-transparent focus:!outline-none focus:!border-0 text-white hover:text-gray-300 transition-colors"
                            >
                                {!showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </Button>
                        </div>
                        <div className="relative w-full">
                            <Input 
                                className="text-white !h-10 !rounded-[3px] pr-10" 
                                placeholder="Confirm your new password" 
                                type={showPassword ? "text" : "password"}
                                value={password} 
                                onChange={handlePasswordChange} 
                                helperText={passwordError}
                            />
                            <Button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 !bg-transparent focus:!outline-none focus:!border-0 text-white hover:text-gray-300 transition-colors"
                            >
                                {!showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center w-[250px] gap-3">
                        <Button variant="outline" className={`text-black w-full !border !border-[#786BAA] rounded-[3px] !h-10`} 
                            disabled={!isLoginFormValid} type="submit">
                            Continue
                        </Button>
                        <Button className={`text-white w-full !border !border-white rounded-[3px] !h-10`}>Cancel</Button>
                    </div>
                </form>
            </div>
        )
    }
}

export default ResetPass;
