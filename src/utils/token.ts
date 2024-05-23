'use client'
import { notFound } from "next/navigation"

export const checkToken = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem("Token")
        if(!token){
            return false;
        } else {
            return true;
        }
    }
    return false; // Return false if window is undefined
}