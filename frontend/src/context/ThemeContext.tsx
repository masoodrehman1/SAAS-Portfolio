"use Client"
import {createContext,useContext,useEffect,useState} from "react"
type Theme= "light"|"dark"
interface ThemeContextType{
    theme:Theme
    toggleTheme:()=>void
}
