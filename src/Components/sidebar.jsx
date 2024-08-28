import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import CreatePostModal from './Post';

export default function Sidebar() {
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Get the user ID from local storage
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      // Fetch user information based on user ID
      fetch(`https://twit-backend-production.up.railway.app/api/posts/user/${userId}`, { // Update this URL to match your backend endpoint
        headers: {
          'Authorization': `${localStorage.getItem('token')}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUserData(data);
        })
        .catch((error) => console.error('Error fetching user data:', error));
    }
  }, [userId]);

  const handleShow = () => {
    setShowModal(true);
    navigate('/post');
  };

  const handleClose = () => {
    setShowModal(false);
    navigate('/home'); // Navigate back to home after closing the modal
  };

  const handleLogout = () => {
    // Clear user data from local storage
    localStorage.removeItem('userId');
    localStorage.removeItem('token');

    // Redirect to login page or home page
    navigate('/login'); // Adjust the route as needed
  };

  return (
    <>
      <div className="sidebar-container sticky-top ps-md-5 g-0 p-0 m-0 b-0 sidebar" style={{ height: "100vh" }}>
        <div className="d-flex flex-column align-items-center align-items-sm-start px-md-3 pt-2 text-white">
          {/* Logo or Brand */}
          <Link to="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none fs-5">
            <span className="fs-5 d-none d-sm-inline">
              <img src="/images/image-removebg-preview (1).png" alt="Logo" className="logo-img" style={{ width: '80px' }} />
            </span>
          </Link>

          {/* Navigation Menu */}
          <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
            <li className="nav-item">
              <Link to="/" className="nav-link align-middle px-0 text-white fs-5">
                <i className="fs-4 bi-house" /> <span className="ms-1 d-none d-sm-inline">Home</span>
              </Link>
            </li>
            <li>
              <Link to="/explore" className="nav-link px-0 align-middle text-white fs-5">
                <i className="fs-4 bi-table" /> <span className="ms-1 d-none d-sm-inline">Explore</span>
              </Link>
            </li>
            <li>
              <Link to="/notifications" className="nav-link px-0 align-middle text-white fs-5">
                <i className="fs-4 bi-people" /> <span className="ms-1 d-none d-sm-inline">Notifications</span>
              </Link>
            </li>
            <li>
              <Link to="/chat" className="nav-link px-0 align-middle text-white fs-5">
                <i className="fs-4 bi-envelope" /> <span className="ms-1 d-none d-sm-inline">Messages</span>
              </Link>
            </li>
            <li>
              <Link to="/communities" className="nav-link px-0 align-middle text-white fs-5">
                <i className="fs-4 bi-people" /> <span className="ms-1 d-none d-sm-inline">Communities</span>
              </Link>
            </li>
            <li>
              <Link to={`/profile/${userId}`} className="nav-link px-0 align-middle text-white fs-5">
                <i className="fs-4 bi-person" /> <span className="ms-1 d-none d-sm-inline">Profile</span>
              </Link>
            </li>
            <li>
              <Link to="#submenu3" className="nav-link px-0 align-middle text-white fs-5" data-bs-toggle="collapse">
                <i className="fs-4 bi-grid" /> <span className="ms-1 d-none d-sm-inline">More</span>
              </Link>
              <ul className="collapse nav flex-column ms-1" id="submenu3" data-bs-parent="#menu">
                <li className="w-100">
                  <Link to="#" className="nav-link px-0 text-white">
                    <span className="d-none d-sm-inline">Product 1</span>
                  </Link>
                </li>
                <li>
                  <Link to="#" className="nav-link px-0 text-white">
                    <span className="d-none d-sm-inline">Product 2</span>
                  </Link>
                </li>
                <li>
                  <Link to="#" className="nav-link px-0 text-white">
                    <span className="d-none d-sm-inline">Product 3</span>
                  </Link>
                </li>
                <li>
                  <Link to="#" className="nav-link px-0 text-white">
                    <span className="d-none d-sm-inline">Product 4</span>
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <button
                className="btn btn-primary px-0 align-middle text-white fs-5 px-md-5 rounded-pill mt-4"
                onClick={handleShow}
              >
                <i className="fs-4 bi-plus" /> <span className="d-none d-sm-inline">Post</span>
              </button>
            </li>
          </ul>

          {/* Divider */}
          <hr className="mt-auto mb-4" />

          {/* User Dropdown */}
          <div className="dropdown">
            <Link
              to="#"
              className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
              id="dropdownUser1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img src={userData?.profilePic} alt="User" width={30} height={30} className="rounded-circle me-2" />
              <span className="d-none d-sm-inline">{userData?.email || 'Username'}</span>
            </Link>
            <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
              <li>
                <Link className="dropdown-item" to="#">
                  New project...
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="#">
                  Settings
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to={`/profile/${userId}`}>
                  Profile
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <Link className="dropdown-item" to="#" onClick={handleLogout}>
                  Sign out
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <CreatePostModal show={showModal} handleClose={handleClose} />
    </>
  );
}
