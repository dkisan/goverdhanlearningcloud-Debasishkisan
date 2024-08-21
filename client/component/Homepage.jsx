import React, { useEffect, useRef, useState } from 'react';
import styles from './homepagestyle.module.css'
import { useNavigate } from 'react-router-dom';
import ProfileInformation from './ProfileInformation';
import { io } from 'socket.io-client';


function Home() {
    const [selectedChat, setSelectedChat] = useState(null);
    const [chat, setChat] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [onlineUser, setOnlineUser] = useState([]);
    const [messages, setMessages] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const msgRef = useRef(null)

    const socket = io('http://localhost:3000')

    useEffect(() => {
        socket.on('connect', () => {
            socket.emit('uid', currentUser)
        })

        socket.on('online', (users) => {
            setOnlineUser(users)
        })

        socket.on('offline', (userId) => {
            setOnlineUser((prev) => prev.filter((user) => user !== userId));
        });


        return () => {
            socket.off('connect')
            socket.off('online')
            socket.off('offline')
        }
    }, [currentUser])

    const navigate = useNavigate()

    const logoutHandler = () => {
        localStorage.removeItem('chatuserToken')
        socket.on('disconnect')
        navigate('/login')
    }


    useEffect(() => {
        if (!localStorage.getItem('chatuserToken')) {
            navigate('/login')
            return
        }
        const getUsers = async () => {
            try {
                const response = await fetch('http://localhost:3000/getalluser', {
                    headers: {
                        Authorization: localStorage.getItem('chatuserToken')
                    }
                })
                const data = await response.json()
                const { users, name } = data
                setChat(users)
                setCurrentUser(name[0].name)
            } catch (err) {
                console.log(err.message)
            }
        }
        getUsers();
    }, [showProfile])

    useEffect(() => {
        const getChats = async () => {
            try {
                const recipient = chat.filter(c => c.name === selectedChat)
                const recipientEmail = recipient[0].email
                const response = await fetch(`http://localhost:3000/getchat/${recipientEmail}`, {
                    headers: {
                        Authorization: localStorage.getItem('chatuserToken')
                    }
                })
                const data = await response.json()
                setMessages(data)
            } catch (err) {
                alert('some error occured')
            }
        }
        if (selectedChat) getChats()
    }, [selectedChat])


    const sendMessageHandler = async () => {
        const message = msgRef.current.value
        const recipient = chat.filter(c => c.name === selectedChat)
        const recipientEmail = recipient[0].email


        if (message === '') {
            alert('Please Write Something')
            return
        }

        try {
            const response = await fetch('http://localhost:3000/sendmsg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('chatuserToken')
                },
                body: JSON.stringify({
                    recipientEmail,
                    message,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessages(prev => [...prev, {role: 'sender', message}])
                // console.log('Message sent successfully!');
                msgRef.current.value = '';
            } else {
                alert('some error occured, Try again')
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }


    }

    const handleChatChange = (chat) => {
        setSelectedChat(chat);
    };

    return (
        <div className={styles.container}>

            {showProfile && <ProfileInformation setShowProfile={setShowProfile} />}

            <nav className={styles.navbar}>
                {/* <h1>Chat App</h1> */}
                <ul>
                    <li><a href="#">Welcome {currentUser}</a></li>
                    <li>
                        <ul>
                            <li onClick={() => setShowProfile(true)}><a href='#'>
                                Profile Information
                            </a>
                            </li>
                            <li onClick={logoutHandler}>Logout</li>
                        </ul>
                    </li>
                </ul>
            </nav>


            <div className={styles.content}>
                <div className={styles.leftpanel}>
                    <ul>
                        {chat && chat.map(c => (
                            <li style={selectedChat === c.name ? { backgroundColor: 'gray', color: 'white', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } : {}} key={c.email} onClick={() => handleChatChange(c.name)}>
                                {c.name}
                                {onlineUser.includes(c.name) && <span> </span>}
                            </li>
                        ))}
                    </ul>
                </div>
                {!selectedChat && <h1>Click to Open Chart</h1>}
                {selectedChat && <div className={styles.rightpanel}>
                    {/* <h2>{selectedChat}</h2> */}
                    <div className={styles.chatwindow}>
                        {messages && messages.map((message, idx) => (
                            <div key={idx} className={message.role === 'receiver' ? styles.message : `${styles.message} ${styles.right}`}>
                                {message.message}
                            </div>
                        ))}
                    </div>
                    <div className={styles.msgbox}>
                        <input ref={msgRef} type="text" placeholder="Type a message..." />
                        <button onClick={sendMessageHandler}>Send</button>
                    </div>
                </div>}
            </div>
        </div>
    );
}

export default Home;