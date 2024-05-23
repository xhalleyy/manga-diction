import { notFound } from "next/navigation"

export const checkToken = () =>{
    const token = localStorage.getItem("Token")
    if(!token){
        return notFound()
    }
}