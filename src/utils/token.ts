'use client'
import { notFound } from "next/navigation"

export const checkToken = () =>{
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem("Token")
        if(!token){
            return notFound()
        }
    }
}