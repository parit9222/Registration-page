import React from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
    return (
        <div>
            <header className='bg-slate-200 shadow-md'>
                <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
                    <ul className='flex gap-4'>
                        <Link to='/'>
                            <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
                        </Link>

                        <Link to='/reg'>
                            <li className='hidden sm:inline text-slate-700 hover:underline'>Registration</li>
                        </Link>
                    </ul>
                </div>
            </header>
        </div>
    )
}
