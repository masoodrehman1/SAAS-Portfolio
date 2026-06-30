"use client"

import { useState } from "react"
import {useDispatch} from "react-redux"
import { useRouter } from "next/navigation"
import { setCredentials } from "@/store/slices/authSlice"
import api from "@/lib/api"
import Link from "next/link"

export default function LoginPage(){
    const[email, setEmail]=useState("")
    const [password,setPassword]= useState('')
    const [error,setError]=useState("")
    const [isLoading,setIsLoading]=useState(false)

    const dispatch =useDispatch()
    const router =useRouter()

    async function handleSubmit(e:React.SyntheticEvent){
        e.preventDefault()
        setIsLoading(true)
        setError("")
        try{
            const formData=new URLSearchParams()
            formData.append("username", email)
            formData.append("password",password)
            const res =await api.post("/login",formData)
            localStorage.setItem("token",res.data.access_token)
            const userRes=await api.get("/me")

            dispatch(setCredentials({
                user:userRes.data, 
                token:res.data.access_token
            }))
            router.push("/dashboard")
        }catch (err:any){
            setError(err.response?.data?.detail || "login failed.Check your credentials.")
        }finally{
            setIsLoading(false)
        }
    }
    return(
        <div className="min-h-screen bg-[#f0f4ff] flex items-center justify-center px-4">
            <div className="bg-white border border-blue-100 rounded-2xl p-8 w-full max-w-sm shadow-lg">
                {/*header*/}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-lg shrink-0">  </div>
                    <div>
                        <div className="font-bold text-[15px] text-gray-900">MasoodDev</div>
                        <div className="text-[11px] text-slate-400 uppercase tracking-wide">Biotech · FullStacK</div>
                    </div>
                </div>
                <h1 className="text-xl font-bold text-gray-900">welcome back</h1>
                <p className="text-sm text-slate-500 mb-6">sign in to continue to ur account</p>
                {error &&(<div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2.5 mb-4">{error}</div>)}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">Email</label>
                        <input
                        type="email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        placeholder="abc@example.com"
                        required
                        className="w-full px-3 py-2.5 text-sm bg-[#fof4ff] border border-blue-100 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                        />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-medium text-slate-600">Password</label>
                            <Link href="/forget_password" className="text-xs text-blue-600 hover:underline">Forgot Password?</Link>
                        </div>
                        <input
                        type="password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full px-3 py-2.5 text-sm bg-[#fof4ff] border border-blue-100 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                        />
                    </div>
                    <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md shadow-blue-200"
                    >
                        {isLoading ? "logging in...":"Log in"}
                    </button>
                </form>
                <p className="text-center text-xs text-slate-400 mt-5">Don&apos;t have account?{""} <Link href="/register" className="text-blue-600 font-medium hover:underline">Create One</Link></p>

            </div>
        </div>
    )
}