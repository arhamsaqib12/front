import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Components/sidebar';
import Home from './Pages/Home';
import Explore from './Pages/explore';
import Chat from './Pages/chat';
import Profile from './Pages/profile';
import Login from './Pages/login';
import SignupModal from './Pages/signup';
import ProtectedRoute from './Pages/protectedRoute';
import IndexPage from './Pages/IndexPage';
import CreatePostModal from './Components/Post';
import Thirdbar from './Pages/thirdbar';
import EditModal from './Pages/Edit'; // Import the EditModal component
import SingleTweet from './Pages/Tweet';
import Hashtag from './Pages/hashtag';
function App() {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const navigate = useNavigate();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // State for Edit Modal

  const handleCloseLogin = () => {
    setShowLoginModal(false);
    navigate(-1); 
  };

  const handleShowLogin = () => setShowLoginModal(true);

  const handleCloseSignup = () => {
    setShowSignupModal(false);
    navigate(-1);
  };

  const handleShowSignup = () => setShowSignupModal(true);

  const handleCloseEdit = () => {
    setShowEditModal(false);
    navigate(-1);
  };

  useEffect(() => {
    if (location.pathname === '/login') {
      handleShowLogin();
    } else {
      setShowLoginModal(false);
    }
    if (location.pathname === '/signup') {
      handleShowSignup();
    } else {
      setShowSignupModal(false);
    }
    if (location.pathname.includes('/edit')) {
      setShowEditModal(true);
    } else {
      setShowEditModal(false);
    }
  }, [location]);

  return (
    <>
      <div className="container-fluid g-0 bg-black w-100  "  style={{height:"100%"}}>
        <div className="row bg-black h-100">
          {token && (
            <div className="col-auto col-md-3 col-sm-2 px-0 bg-black bg-black sticky-top"  style={{ height:"100vh"} } >
              <Sidebar />
            </div>
          )}
          <div className={`col ${token ? 'col-md-6 col-sm-10 px-0' : ''}`}>
            <Routes>
              {token ? (
                <>
                  <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                  <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
                  <Route path="/chat" element={<ProtectedRoute><Chat/></ProtectedRoute>} />
                  <Route path="/profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/edit/:userId" element={<ProtectedRoute><EditModal></EditModal></ProtectedRoute>} />
                  <Route path="*" element={<Navigate to="/home" />} />
                  
                  <Route path="/tweet/:tweetId" element={<ProtectedRoute>< SingleTweet /></ProtectedRoute>} />
                 
                  <Route path="/hashtag/:hashtag" element={<Hashtag />} />
                </>
              ) : (
                <>
                  <Route path="/login" element={<IndexPage />} />
                  <Route path="/signup" element={<IndexPage />} />
                  <Route path="/" element={<IndexPage />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              )}
            </Routes>
          </div>
          {token && location.pathname !== '/explore' && location.pathname !== '/chat' && (
  <div className="col-auto col-md-3 col-sm-2 px-0 bg-black d-none d-md-block sticky-top">
    <Thirdbar />
  </div>
)}

        </div>
      </div>

      <SignupModal show={showSignupModal} handleClose={handleCloseSignup} />
      <Login show={showLoginModal} handleClose={handleCloseLogin} />
      {token && location.pathname === '/post' && <CreatePostModal />}
      {token && <EditModal show={showEditModal} handleClose={handleCloseEdit} />}
    </>
  );
}

export default App;
