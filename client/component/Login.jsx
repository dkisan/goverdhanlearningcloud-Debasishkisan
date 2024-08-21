import React, { useRef, useState } from 'react';

import styles from './loginstyle.module.css'
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const roleRef = useRef(null);
    // const errorRef = useRef(null);

    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userData = {
                email: emailRef.current.value,
                password: passwordRef.current.value,
                role: roleRef.current.value
            };

            if (!Object.values(userData).every(Boolean)) {
                alert("Please fill all fields.");
                return;
            }

            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('chatuserToken', data.token)
                alert(data.message)
                navigate('/')
            } else {
                alert(data.message)
            }

        } catch (err) {
            console.log(err.message)
        }
    };


    return (
        <div className={styles.container}>
            <div className={styles.loginform}>
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <label
                        htmlFor='emailid'>
                        Email:
                    </label>
                    <input
                        id='emailid'
                        type="email"
                        ref={emailRef}
                    />
                    <br />
                    <label
                        htmlFor='passwordid'>
                        Password:
                    </label>
                    <input
                        id='passwordid'
                        type="password"
                        ref={passwordRef} />
                    <br />
                    <label
                        htmlFor='roleid'>
                        Role:
                    </label>
                    <select
                        id='roleid'
                        ref={roleRef}>
                        <option value="Teacher">
                            Teacher
                        </option>
                        <option value="Student">
                            Student
                        </option>
                        <option value="Institute">
                            Institute
                        </option>
                    </select>
                    <button type="submit">Login</button>
                </form>
                <p style={{ marginTop: '10px', textAlign: 'right' }}>Create Account
                    <Link to={'/signup'}>Signup</Link>
                </p>
                {/* {error && <div style={{ color: 'red' }}>{error}</div>} */}
            </div>
        </div>
    );
};

export default Login;