import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/components/ui/button"
import { Input } from "@/components/components/ui/input";
import { signIn } from "@/apis/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { googleSignIn } from '@/apis/auth';
import { logoutUser } from '@/apis/auth';
import { getUserRoles } from "@/apis/auth";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const [redirect, setRedirect]  = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [redirectPath, setRedirectPath] = useState<string | null>(null);

    const isLoginFormValid = email.trim() !== '' && password.trim() !== '';
    const searchParams = new URLSearchParams(location.search);
    const redirectTo = searchParams.get('redirectTo') ? decodeURIComponent(searchParams.get('redirectTo') as string) : '/dashboard';
    
    useEffect(() => {
        // Simulate initial loading and fetch token from session storage
        const initializePage = async () => {
            // Add a small delay to show loading state
            await new Promise(resolve => setTimeout(resolve, 500));

            const storedToken = sessionStorage.getItem('token')
            setToken(storedToken)
            if (storedToken) {
                navigate(redirectTo, { replace: true }) // Use replace to avoid double redirects
            } else {
                setToken(storedToken)
                setRedirect(redirectTo)
            }
            setIsPageLoading(false)
        }

        initializePage()
    }, [])

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value.toLowerCase())
        setEmailError('')
    }

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value)
      setPasswordError('')
    }

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

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
            const roles = await getUserRoles();
            let hasOrgId = false;
            for (const key in roles) {
              if (roles[key] && roles[key].organization_id && roles[key].organization_id !== 0) {
                hasOrgId = true;
                break;
              }
            }
            toast.success('Login successful! Redirecting to dashboard...', {
              duration: 3000,
              position: 'top-right',
              icon: '🔑',
              style: {
                backgroundColor: '#000',
                color: '#fff',
              },
            });
            if (!hasOrgId) {
              setRedirectPath('/dashboard');
            } else if (redirect) {
              setRedirectPath(redirect);
            }
          }
        } catch (error) {
          console.error('An error occurred:', error)
        } finally {
          setIsLoading(false)
        }
    }

    const googleLogin = useGoogleLogin({
      onSuccess: async (credentialResponse) => {
        if (!credentialResponse) {
          toast.error('Google login failed: No credential received');
          return;
        }
        setIsLoading(true);
        try {
          let userData: any = {};
          if (credentialResponse.access_token) {
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${credentialResponse.access_token}` },
            });
            userData = await res.json();
          }
          if (!userData || !userData.email) {
            toast.error('Google login failed: Unable to fetch user info');
            setIsLoading(false);
            return;
          }
          const response = await googleSignIn({
            email: userData.email,
            givenName: userData.given_name,
            familyName: userData.family_name,
            photo: userData.picture,
            name: userData.name,
            id: userData.sub,
          });
          if (response.error) {
            if (response.error.message === 'User not registered' || response.error.message === 'User is not registered') {
              toast.error('Your Google account is not registered. Please sign up or contact support.');
              setIsLoading(false);
              return;
            }
            toast.error('Google login failed.');
            setIsLoading(false);
            return;
          } else if (response.tokens) {
            const roles = await getUserRoles();
            let hasOrgId = false;
            for (const key in roles) {
              if (roles[key] && roles[key].organization_id && roles[key].organization_id !== 0) {
                hasOrgId = true;
                break;
              }
            }
            toast.success('Login successful! Redirecting to dashboard...', {
              duration: 3000,
              position: 'top-right',
              icon: '🔑',
              style: {
                backgroundColor: '#000',
                color: '#fff',
              },
            });
            if (!hasOrgId) {
              setRedirectPath('/dashboard');
            } else if (redirect) {
              setRedirectPath(redirect);
            }
          }
        } catch (error) {
          toast.error('Google login failed.');
          console.error('Google login error:', error);
        } finally {
          setIsLoading(false);
        }
      },
      onError: () => {
        toast.error('Google login failed.');
      },
      flow: 'implicit',
    });

    useEffect(() => {
      if (redirectPath) {
        navigate(redirectPath);
      }
    }, [redirectPath, navigate]);

    // Loading component
    const LoadingSpinner = () => (
        <div className="flex flex-col items-center justify-center w-full gap-4 min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <p className="text-white text-sm">Loading...</p>
        </div>
    );

    if (isPageLoading) {
        return <LoadingSpinner />;
    }

    if (!token) {
        return (
            <div className="flex flex-col items-center justify-center w-full gap-7">
                <svg preserveAspectRatio="xMidYMid meet" data-bbox="0 0 360 70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 70" height="15.56" width="80" data-type="color" role="presentation" aria-hidden="true" aria-label="">
                    <g>
                        <path fill="#ffffff" d="M0 2.059h30.856l7.817 30.882L46.49 2.06h23.999l7.816 30.882L86.123 2.06h30.856L94.488 67.94H66.923l-8.502-29.51-8.366 29.51H22.491z" data-color="1"></path>
                        <path fill="#ffffff" d="M120.244 2.059H151.1V67.94h-30.856z" data-color="1"></path>
                        <path fill="#ffffff" d="m154.221 52.431 27.564-30.058h-26.878V2.058h68.843V17.43l-27.291 30.196h28.388V67.94h-70.626z" data-color="1"></path>
                        <path fill="#ffffff" d="M267.76 70q-20.297 0-31.679-9.059-11.245-9.059-11.245-25.666 0-16.334 10.148-25.804Q245.269 0 264.469 0q12.205 0 20.845 4.53 8.776 4.529 13.165 12.352 4.525 7.824 4.525 17.569v8.922h-48.821q3.978 7.137 17.965 7.137 6.446 0 13.44-.961 7.131-1.098 12.068-3.02v18.53q-5.486 2.196-13.577 3.568Q276.126 70 267.76 70m6.171-43.51q-1.646-6.862-10.011-6.862-8.091 0-9.737 6.862z" data-color="1"></path>
                        <path fill="#ffffff" d="M305.694 2.059h29.758V7.96q3.84-3.569 10.423-5.765Q352.457 0 360 0v23.882q-8.09 0-14.674 2.196-6.445 2.06-8.777 5.902v35.961h-30.855z" data-color="1"></path>
                    </g>
                </svg>
                <form onSubmit={handleFormSubmit}>
                    <div className="flex flex-col items-center justify-center w-[250px] gap-2.5">
                        <Input className="text-white !h-10 !rounded-[3px]" placeholder="Email Address"
                            value={email} onChange={handleEmailChange} helperText={emailError}/>
                        <div className="relative w-full">
                            <Input 
                                className="text-white !h-10 !rounded-[3px] pr-10" 
                                placeholder="Password" 
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
                    <div className="flex flex-col items-end justify-center w-[250px] pt-1.5 pb-[18px]">
                        <a className="!text-white" href="/forgot-password">Forgot Password?</a>
                    </div>
                    <div className="flex flex-col items-center justify-center w-[250px] gap-3">
                        <Button variant="outline" className={`text-black w-full !border !border-[#786BAA] rounded-[3px] !h-10`}
                            disabled={!isLoginFormValid || isLoading} type="submit">
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Logging in...
                                </div>
                            ) : 'Login'}
                        </Button>
                        <span className="text-white">or</span>
                        {/* Custom Google Login Button */}
                        <button
                          type="button"
                          onClick={() => googleLogin()}
                          className="w-full flex items-center justify-center h-12 rounded-md border-2 border-white bg-[#8B73B1] hover:bg-[#9c85c3] transition-colors font-bold text-white text-[1.25rem] leading-none"
                          style={{ fontWeight: 700, fontSize: '1.25rem', borderRadius: 6 }}
                          disabled={isLoading}
                        >
                          Login with Google
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}

export default Login;
