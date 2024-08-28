import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import UserSearch from './UserSearch';


function parseJwt(token) {
    if (!token) return {};
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    return JSON.parse(jsonPayload);
}

function generateRoomId(userId1, userId2) {
    const sortedIds = [userId1, userId2].sort();
    return `${sortedIds[0]}_${sortedIds[1]}`;
}

async function fetchUserDetails(userId, token) {
    try {
        const response = await fetch(`https://twit-backend-production.up.railway.app/api/posts/user/${userId}`, {
            headers: { 'Authorization': token }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user details:', error);
        return null;
    }
}

function setupSocketConnection(url, roomId, userId, onMessage, onNotification) {
    const socket = io(url, { perMessageDeflate: false });

    socket.emit('joinRoom', { roomId, userId });

    socket.on('message', (message) => {
        console.log('Received message:', message);
        onMessage(message);
    });
    socket.on('notifyUser', onNotification);

    return socket;
}

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserSearch, setShowUserSearch] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
    const [socket, setSocket] = useState(null);

    const userToken = localStorage.getItem('token');
    const userId = userToken ? parseJwt(userToken).id : null;
    const roomId = selectedUser ? generateRoomId(userId, selectedUser.id) : null;

    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!userId || !roomId) return;

        const newSocket = setupSocketConnection(
            "https://twit-backend-production.up.railway.app" || 'http://localhost:5000',
            roomId,
            userId,
            (message) => {
                setMessages(prevMessages => [...prevMessages, message]);
            },
            (notification) => {
                setNotifications(prevNotifications => [...prevNotifications, notification]);
            }
        );

        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, [roomId, userId, selectedUser]);

    const sendMessage = () => {
        if (message.trim() === '' || !socket) return;

        socket.emit('chatMessage', { roomId, message, senderId: userId, recipientId: selectedUser.id });
        setMessage('');
    };

    const handleUserSelect = async (userId) => {
        const user = await fetchUserDetails(userId, userToken);
        if (user) {
            setSelectedUser(user);
            setMessages([]); // Clear previous messages
            setShowUserSearch(false); // Hide the user search modal
        }
    };

    const handleShowUserSearch = () => setShowUserSearch(true);
    const handleCloseUserSearch = () => setShowUserSearch(false);

    return (
        <div className="container-fluid g-0 bg-black text-light">
            <div className="row" style={{ height: '100vh' }}>
                {/* User Search Section */}
                <div
                    className={`col-md-4 ${isSmallScreen && selectedUser ? 'd-none' : ''}`}
                    style={{ borderRight: '2px solid grey', borderLeft: '2px solid grey' }}
                >
                    <div className="fs-3 fw-bold m-2">Messages</div>
                    <div className="fs-2 fw-bold m-2 my-4">Welcome to your <br /> inbox!</div>
                    <div className="fw-light m-2 my-1" style={{ fontSize: "16px" }}>
                        Drop a line, share posts and more with private conversations between you and others on X.
                    </div>
                    <hr />
                    <button className="btn btn-primary mt-3" onClick={handleShowUserSearch}>
                        Search Users
                    </button>
                    <UserSearch
                        show={showUserSearch}
                        onHide={handleCloseUserSearch}
                        onUserSelect={handleUserSelect}
                    />
                    {/* Notifications */}
                </div>
                {/* Chat Section */}
                <div className={`col-md-8 ${isSmallScreen && !selectedUser ? 'd-none' : ''}`}>
                    {selectedUser ? (
                        <div className="p-3" style={{ height: '100%' }}>
                            <div className="d-flex align-items-center mb-3">
                                <img
                                    src={`${selectedUser.profilePic}`}
                                    alt={`${selectedUser.name}'s profile`}
                                    className="rounded-circle me-2"
                                    style={{ width: '50px', height: '50px' }}
                                />
                                <h3>{selectedUser.name}</h3>
                            </div>
                            <div className="chat-box bg-dark p-3" style={{ height: '70vh', overflowY: 'scroll' }}>
                                {messages.map((msg, index) => (
                                    <div key={index} className={`d-flex mb-2 ${msg.senderId === userId ? 'justify-content-end' : 'justify-content-start'}`}>
                                        <div className={`p-2 rounded ${msg.senderId === userId ? 'bg-primary text-light' : 'bg-secondary text-dark'}`} style={{ maxWidth: '70%' }}>
                                            <div className="d-flex align-items-center">
                                                <img
                                                    src={`${msg.senderProfilePic}`}
                                                    alt={`${msg.senderName}'s profile`}
                                                    className="rounded-circle me-2"
                                                    style={{ width: '30px', height: '30px' }}
                                                />
                                                <strong>{msg.senderName}:</strong> {msg.message}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="input-group mt-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Type a message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                />
                                <button className="btn btn-primary" onClick={sendMessage}>
                                    Send
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="d-flex justify-content-center align-items-center h-100">
                            Select a user to start chatting!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
