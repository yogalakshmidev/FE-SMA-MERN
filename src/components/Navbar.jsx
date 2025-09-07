import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import ProfileImage from "./ProfileImage";
import { useSelector, shallowEqual } from "react-redux";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // ✅ Use shallowEqual or select primitives individually
  const userId = useSelector(
    (state) => state.user.currentUser?.id,
    shallowEqual
  );
  const token = useSelector(
    (state) => state.user.currentUser?.token,
    shallowEqual
  );
  const profilePhoto = useSelector(
    (state) => state.user.currentUser?.profilePhoto,
    shallowEqual
  );

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) {
      setShowResults(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/search?query=${search}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setResults(res.data);
      setShowResults(true);
    } catch (err) {
      console.error("Search error:", err.response?.data || err.message);
      setResults([]);
      setShowResults(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="container navbar__container">
        <Link to="/" className="navbar__logo">
          SMA-MERN
        </Link>

        <div className="navbar__search-wrapper" style={{ position: "relative" }}>
          <form className="navbar__search" onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => search && setShowResults(true)}
            />
            <button type="submit">
              <CiSearch />
            </button>
          </form>

          {showResults && search.trim() !== "" && (
            <div className="search-dropdown">
              {loading ? (
                <p className="loading">Searching...</p>
              ) : results.length > 0 ? (
                results.map((user) => (
                  <Link
                    key={user._id}
                    to={`/users/${user._id}`}
                    className="search-result"
                    onClick={() => setShowResults(false)}
                  >
                    <ProfileImage image={user.profilePhoto} />
                    <span>{user.fullName}</span>
                  </Link>
                ))
              ) : (
                <p className="no-results">No user found</p>
              )}
            </div>
          )}
        </div>

        <div className="navbar__right">
          {userId && (
            <Link to={`/users/${userId}`} className="navbar__profile">
              <ProfileImage image={profilePhoto} />
            </Link>
          )}
          {token ? <Link to="/logout">Logout</Link> : <Link to="/login">Login</Link>}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
