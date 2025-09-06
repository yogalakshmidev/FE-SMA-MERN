import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CiSearch } from 'react-icons/ci';
import ProfileImage from './ProfileImage';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const navigate = useNavigate();

  const userId = useSelector(state => state?.user?.currentUser?.id);
  const token = useSelector(state => state?.user?.currentUser?.token);
  const profilePhoto = useSelector(state => state?.user?.currentUser?.profilePhoto);
  const fullName = useSelector(state => state?.user?.currentUser?.fullName);

  // redirect to login page if the user has no token
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // log user out after an hour
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/logout');
    }, 1000 * 60 * 60);

    return () => clearTimeout(timer); 
  }, [navigate]);

  return (
    <nav className="navbar">
      <div className="container navbar__container">
        <Link to="/" className="navbar__logo">
          SMA-MERN
        </Link>

        <form className="navbar__search">
          <input type="search" placeholder="Search" />
          <button type="submit">
            <CiSearch />
          </button>
        </form>

        <div className="navbar__right">
          {userId && (
            <Link to={`/users/${userId}`} className="navbar__profile">
              <ProfileImage image={profilePhoto} />
              {/* Optional: show name beside avatar */}
              {/* <span>{fullName}</span> */}
            </Link>
          )}
          {token ? (
            <Link to="/logout">Logout</Link>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
