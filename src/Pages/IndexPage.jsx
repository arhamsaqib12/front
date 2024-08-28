import React from 'react';
import { Link } from 'react-router-dom';

export default function IndexPage() {
  return (
    <div className="container-fluid g-0 p-0 m-0  bg-black d-flex flex-column justify-content-center align-items-center  px-md-0 px-4 " style={{height:"100vh"}}>
      <div className="row w-100">
        <div className="col-12 col-md-6 d-flex justify-content-start justify-content-md-center align-items-center mb-4 mb-md-0">
          <img src="/images/image-removebg-preview (1).png" alt="Logo" className="logo-img " />
        </div>

        <div className="col-12 col-md-6 d-flex flex-column justify-content-center">
          <div className="fw-bold text-light mb-3" style={{ fontSize: '50px' }}>
            Happening now
          </div>
          <div className="fw-bold text-light mb-3" style={{ fontSize: '30px' }}>
            Join today.
          </div>
          <Link to="/login">
            <button
              className="btn btn-light align-middle fs-5 fw-medium rounded-pill mt-4"
              style={{ padding: '3px 125px' }}
            >
              Login
            </button>
          </Link>
          <div className="d-flex align-items-center">
            <hr className="w-25" style={{ borderColor: 'lightgrey' }} />
            <span className="mx-2 text-light">or</span>
            <hr className="w-25" style={{ borderColor: 'lightgrey' }} />
          </div>
          <Link to="/signup">
            <button
              className="btn btn-primary align-middle text-white fs-5 fw-medium rounded-pill"
              style={{ padding: '3px 85px' }}
            >
              Create account
            </button>
          </Link>
          <div className="fw-light text-light mt-1 mb-5" style={{ fontSize: '11px' }}>
            By signing up, you agree to the <span className="text-primary"> Terms of Service </span> and <span className="text-primary"> Privacy Policy </span>,<br /> including Cookie Use.
          </div>
          <div className="fw-bold text-light mb-3" style={{ fontSize: '20px' }}> Already have an account?</div>
          <Link to="/login">
            <button
              className="btn btn-primary align-middle text-white fs-5 fw-bold rounded-pill"
              style={{ padding: '3px 125px' }}
            >
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
