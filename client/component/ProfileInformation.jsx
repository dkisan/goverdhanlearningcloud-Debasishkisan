import { useEffect, useRef, useState } from 'react';
import styles from './profilestyle.module.css'
import { useNavigate } from 'react-router-dom';

const ProfileInformation = (props) => {
    const [user, setUser] = useState(null)
    const [isEdit, setIsEdit] = useState(false)
    const [updateUser, setUpdateUser] = useState(null)
    const navigate = useNavigate()

    const getUser = async () => {
        try {
            const response = await fetch(`http://localhost:3000/getuser`, {
                headers: {
                    Authorization: localStorage.getItem('chatuserToken')
                }
            })
            const data = await response.json()
            setUser(data[0])
            setUpdateUser(data[0])
        } catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {

        getUser();
    }, [])


    const editHandler = (e) => {
        e.stopPropagation()
        setIsEdit(true)
        console.log(user)
    }

    const nameChangeHandler = (e) => {
        setUpdateUser({ ...updateUser, name: e.target.value })
    }


    const phonenoChangeHandler = (e) => {
        setUpdateUser({ ...updateUser, phoneno: e.target.value })
    }

    const roleChangeHandler = (e) => {
        setUpdateUser({ ...updateUser, role: e.target.value })
    }

    const updateHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch('http://localhost:3000/updateuser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateUser),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message)
                await getUser()
            }

        } catch (err) {
            // setError(err.message);
        }

    }

    const deleteHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch('http://localhost:3000/deleteuser', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateUser),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message)
                localStorage.removeItem('chatuserToken')
                navigate('/login')
            }

        } catch (err) {
            // setError(err.message);
        }

    }


    return (
        <div className={styles.container} onClick={() => props.setShowProfile(false)}>
            <div className={styles.content} onClick={(e) => e.stopPropagation()}>
                {user && <div className={styles.userinfo}>
                    <span>{user.name}</span>
                    <span>{user.email}</span>
                    <span>{user.phoneno}</span>
                    <span>{user.role}</span>
                    <button onClick={(e) => editHandler(e)} style={{ backgroundColor: 'green' }}>Edit</button>
                    <button onClick={deleteHandler} style={{ backgroundColor: 'red' }}>Delete Account</button>
                </div>}

                {isEdit && <div>
                    <form className={styles.updateform} onSubmit={updateHandler}>
                        <label htmlFor='nameid'>Name:</label>
                        <input
                            value={updateUser.name}
                            id='nameid'
                            type="text"
                            onChange={nameChangeHandler}
                        />
                        <br />
                        <label htmlFor='phoneid'>Phone Number:</label>
                        <input
                            value={updateUser.phoneno}
                            id='phoneid'
                            type="tel"
                            inputMode='numeric'
                            onChange={phonenoChangeHandler}
                        />
                        <br />
                        <label htmlFor='roleid'>Role:</label>
                        <select
                            value={updateUser.role}
                            id='roleid'
                            onChange={roleChangeHandler}
                        >
                            <option value="Teacher">Teacher</option>
                            <option value="Student">Student</option>
                            <option value="Institute">Institute</option>
                        </select>
                        <br />
                        <button type="submit">Update</button>
                    </form>
                </div>}
            </div>
        </div>
    )
}

export default ProfileInformation;