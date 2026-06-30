"use client"
import { useState } from "react";
import {useDispatch} from "react-redux"
import { useRouter } from "next/navigation";
import { setCredentials } from "@/store/slices/authSlice";
import { IconDna2 } from "@tabler/icons-react";
import api from "@/lib/api"
import Link from "next/link"
interface FormData{
    username:string
    email:string
    password:string 
    confirmPassword:string 
}
export default function RegisterPage(){
    const [formData,setFormData]=useState<FormData>({
        username:"",
        email:"",
        password:"",
        confirmPassword:""
    })
    const [isLoading,setIsLoading]=useState(false)
    const[error,setError]=useState("")
    const dispatch=useDispatch()
    const router=useRouter()

    function handleChange(e:React.ChangeEvent<HTMLInputElement>){
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }
    async function handleSubmit(e:React.SubmitEvent){
      e.preventDefault()
      if (formData.password!==formData.confirmPassword){
        setError("password donot match.")
        return
      }
      if (formData.password.length<6){
        setError("password must be atleast 6 characters.")
        return
      }
      setError("")
      setIsLoading(true)
      try {
        await api.post("/register",{
            username: formData.username,
            email:formData.email,
            password:formData.password
        })
        const loginData=new URLSearchParams()
        loginData.append("username",formData.email)
        loginData.append("password",formData.password)
        const res = await api.post("/login",loginData)
        localStorage.setItem("token",res.data.access_token)
        const useRes=await api.get("/me")
        dispatch(setCredentials({
            user:useRes.data,
            token:res.data.access_token
        }))
        router.push("/dashboard")
      } catch (err:unknown){
        const e=err as {response?:{data?:{detail?:string}}}
        setError(e.response?.data?.detail|| "registration failed. Try again")
      }finally{
        setIsLoading(false)
      }

    }
    return(
        <div className="min-h-screen bg-[#f0f4ff] flex items-center justify-center px-4 py-10">
            <div className="bg-white border border-blue-100 rounded-2xl p-8 w-full max-w-sm shadow-lg">
                <div className="flex items-center mb-6 gap-3">
                    
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-lg shrink-0">
                        <IconDna2 size={20} stroke={1.8}/>
                    </div>
                    <div>
                        <div className="text-[15px] font-bold text-gray-900">MasoodDev</div>
                        <div className="text-[11px] text-slate-400 uppercase tracking-wide">Biotech · Full-Stack</div>
                    </div>

                </div>
                <h1 className="text-xl font-bold text-gray-900 mb1">Create Account</h1>
                <p className="text-sm text-slate-500 mb-6">Jion MasoodDev  — it&apos;s free</p>
                {error&&(
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg mb-4 px-3 py-2.5">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">Username</label>
                        <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="masood123"
                        required
                        className="w-full px-3 py-2.5 text-sm bg-[#f0f4ff] border border-blue-100 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium mb-1.5 text-slate-600 block">Email</label>
                        <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        className="w-full px-3 py-2.5 text-sm bg-[#f0f4ff] border border-blue-100 focus:border-blue-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1.5 text-slate-600">Password</label>
                        <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Min. 6 Characters"
                        required
                        className="px-3 py-2.5 w-full text-sm bg-[#f0f4ff] outline-none border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1.5 text-xs text-slate-600">Confirm Password</label>
                        <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Repeat your password"
                        required
                        className="w-full px-3 py-2.5 bg-[#f0f4ff] text-sm border border-blue-100 outline-none rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                        />
                        {formData.confirmPassword &&(
                            <p className={`text-xs mt-1.5 ${formData.password===formData.confirmPassword?"text-gray-600":"text-red-500"}`}>{
                                formData.password===formData.confirmPassword?"✓ Passwords match": "✗ Passwords do not match"
                            }</p>
                        )}
                    </div>
                    <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md shadow-blue-200"

                    >
                        {
                            isLoading? "Creating account...": "Create new account"
                        }
                    </button>
                </form>
                <p className="text-center mt-5 text-xs text-slate-400">Already have an account?{""}
                    <Link href="/login">Login</Link>
                </p>
            </div>
        </div>
    )
}
