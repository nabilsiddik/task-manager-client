import React, { useContext } from 'react'
import { FaGoogle } from 'react-icons/fa';
import { authContext } from '../../Contexts/AuthContext';

const Login = () => {

    const { signInWithGoogle, user } = useContext(authContext)

    return (
        <div id='login_page'>
            <div className="container py-10">
                <h1 className='text-center mb-10 text-5xl font-bold'>Login</h1>
                <div className='flex justify-center'>
                    <button onClick={() => signInWithGoogle()} className='btn btn-lg flex items-center text-3xl gap-3 bg-yellow-500 font-bold py-6 px-5 rounded-lg cursor-pointer'><FaGoogle />Sign In Google
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login
