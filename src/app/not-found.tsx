import Link from 'next/link'

export default function NotFound() {
    return (
        <div className='h-screen flex flex-col bg-offwhite justify-center items-center'>
            <h2 className='text-center font-poppinsBold text-3xl lg:text-5xl !text-darkbrown'>401 | Unauthorized Access</h2>
            <p className='text-center font-mainFont text-black text-2xl py-3'>You are not authorized to view this page.</p>
            <Link className='underline font-mainFont hover:italic' href="/">Return to Login</Link>
        </div>
    )
}