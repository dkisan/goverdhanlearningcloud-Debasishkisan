import React, { useRef, useState } from 'react';
import styles from './signupstyle.module.css'
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {

    const navigate = useNavigate()

    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneNumberRef = useRef(null);
    const roleRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);



    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const userData = {
                name: nameRef.current.value,
                email: emailRef.current.value,
                phoneno: +phoneNumberRef.current.value,
                role: roleRef.current.value,
                password: passwordRef.current.value,
                confirmPassword: confirmPasswordRef.current.value,
            };

            if (!Object.values(userData).every(Boolean)) {
                alert("Please fill all fields.");
                return;
            }

            if (userData.password !== userData.confirmPassword) {
                alert("Passwords do not match");
                passwordRef.current.focus()
                return;
            }

            const response = await fetch('http://localhost:3000/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            if (response.ok) {
                const data = await response.json();
                alert(data.message)
                navigate('/login')
            } else {
                alert('some error occured')
            }

        } catch (err) {
            // setError(err.message);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.signupform}>
                <h1>Signup</h1>
                <form onSubmit={handleSignup}>
                    <label htmlFor='nameid'>Name:</label>
                    <input
                        id='nameid'
                        type="text"
                        ref={nameRef}
                    />
                    <br />
                    <label htmlFor='emailid'>Email:</label>
                    <input
                        id='emailid'
                        type="email"
                        ref={emailRef}
                    />
                    <br />
                    <label htmlFor='phoneid'>Phone Number:</label>
                    <input
                        id='phoneid'
                        type="tel"
                        inputMode='numeric'
                        ref={phoneNumberRef}
                    />
                    <br />
                    <label htmlFor='roleid'>Role:</label>
                    <select
                        id='roleid'
                        ref={roleRef}
                    >
                        <option value="Teacher">Teacher</option>
                        <option value="Student">Student</option>
                        <option value="Institute">Institute</option>
                    </select>
                    <br />
                    <label htmlFor='passwordid'>Password:</label>
                    <input
                        id='passwordid'
                        type="password"
                        ref={passwordRef}
                    />
                    <br />
                    <label htmlFor='confirmid'>Confirm Password:</label>
                    <input
                        id='confirmid'
                        type="password"
                        ref={confirmPasswordRef}
                    />
                    <br />
                    <button type="submit">Signup</button>
                </form>
                <p style={{ marginTop: '10px', textAlign: 'right' }}>Already Have an Account
                    <Link to={'/login'}>Login</Link>
                </p>
                {/* {error && <div className={styles.errormessage}>{error}</div>} */}
            </div>
        </div>
    );
};


export default Signup;