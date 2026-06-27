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
    return(
        <div>
            <div>
                <h1>Login</h1>
                <input/>
                <input/>
                <button/>
            </div>
        </div>
    )
}