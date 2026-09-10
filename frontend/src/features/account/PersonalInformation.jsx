import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./PersonalInformation.css";

const PersonalInformation = () => {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
  });


  // =========================================
  // GET PROFILE FROM DATABASE
  // =========================================

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const loggedInUser = JSON.parse(storedUser);

    const fetchProfile = async () => {

      try {

        const response = await api.get(
          `/auth/profile/${loggedInUser.id}`
        );

        console.log("Profile from DB:", response.data);

        if (response.data.success) {

          setUser(response.data.user);

          setFormData({
            firstName: response.data.user.firstName || "",
            lastName: response.data.user.lastName || "",
            dob: response.data.user.dob
              ? response.data.user.dob.split("T")[0]
              : "",
            email: response.data.user.email || "",
          });

        }

      } catch (error) {

        console.error("Profile Fetch Error:", error);

      } finally {

        setLoading(false);

      }

    };

    fetchProfile();

  }, [navigate]);


  // =========================================
  // INPUT CHANGE
  // =========================================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  // =========================================
  // EDIT
  // =========================================

  const handleEdit = () => {

    setEditing(true);

  };


  // =========================================
  // SAVE
  // =========================================

  const handleSave = async () => {

    try {

      const storedUser =
        localStorage.getItem("user") ||
        sessionStorage.getItem("user");

      const loggedInUser = JSON.parse(storedUser);

      const response = await api.put(
        `/auth/profile/${loggedInUser.id}`,
        formData
      );

      if (response.data.success) {

        setUser(response.data.user);

        setFormData({
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          dob: response.data.user.dob
            ? response.data.user.dob.split("T")[0]
            : "",
          email: response.data.user.email,
        });

        setEditing(false);

        // Update stored basic user information
        const updatedStoredUser = JSON.stringify({
          ...loggedInUser,
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          email: response.data.user.email,
          dob: response.data.user.dob,
        });

        if (localStorage.getItem("user")) {
          localStorage.setItem("user", updatedStoredUser);
        } else {
          sessionStorage.setItem("user", updatedStoredUser);
        }

        alert("Information updated successfully!");

      }

    } catch (error) {

      console.error("Update Error:", error);

      alert(
        error.response?.data?.message ||
        "Unable to update information"
      );

    }

  };


  // =========================================
  // CANCEL
  // =========================================

  const handleCancel = () => {

    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      dob: user.dob
        ? user.dob.split("T")[0]
        : "",
      email: user.email || "",
    });

    setEditing(false);

  };


  if (loading) {

    return (
      <div className="personal-page">
        <div className="personal-loading">
          Loading your information...
        </div>
      </div>
    );

  }


  if (!user) {

    return (
      <div className="personal-page">
        <div className="personal-card">
          <h2>User information not found</h2>
          <p>Please login again.</p>
        </div>
      </div>
    );

  }


  return (

    <div className="personal-page">

      {/* =================================
          HEADER
      ================================= */}

      <div className="personal-header">

        <h1>
          Personal Information
        </h1>

        <p>
          Manage your personal details
        </p>

      </div>


      {/* =================================
          CARD
      ================================= */}

      <div className="personal-card">


        {/* PROFILE */}

        <div className="personal-profile">

          <div className="personal-avatar">
            👤
          </div>

          <div>

            <h2>
              {user.firstName} {user.lastName}
            </h2>

            <p>
              Movira Member 🎬
            </p>

          </div>

        </div>


        {/* INFORMATION */}

        <div className="personal-info">


          {/* FIRST NAME */}

          <div className="info-box">

            <span>First Name</span>

            {editing ? (

              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />

            ) : (

              <strong>
                {user.firstName || "N/A"}
              </strong>

            )}

          </div>


          {/* LAST NAME */}

          <div className="info-box">

            <span>Last Name</span>

            {editing ? (

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />

            ) : (

              <strong>
                {user.lastName || "N/A"}
              </strong>

            )}

          </div>


          {/* EMAIL */}

          <div className="info-box">

            <span>Email</span>

            {editing ? (

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />

            ) : (

              <strong>
                {user.email || "N/A"}
              </strong>

            )}

          </div>


          {/* DOB */}

          <div className="info-box">

            <span>Date of Birth</span>

            {editing ? (

              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />

            ) : (

              <strong>
                {user.dob
                  ? new Date(user.dob).toLocaleDateString("en-IN")
                  : "N/A"}
              </strong>

            )}

          </div>

        </div>


        {/* =================================
            PASSWORD
        ================================= */}

        <div className="password-section">

          <h3>
            Password
          </h3>

          <div className="password-row">

            <input
              type={showPassword ? "text" : "password"}
              value="••••••••"
              readOnly
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? "Hide" : "Show"}
            </button>

          </div>

          <p>
            Your password is securely encrypted.
          </p>

        </div>


        {/* =================================
            BUTTONS
        ================================= */}

        {!editing ? (

          <button
            className="edit-profile-btn"
            onClick={handleEdit}
          >
            ✏️ Edit Information
          </button>

        ) : (

          <div className="edit-buttons">

            <button
              className="save-profile-btn"
              onClick={handleSave}
            >
              ✓ Save Changes
            </button>

            <button
              className="cancel-profile-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>

          </div>

        )}

      </div>

    </div>

  );

};

export default PersonalInformation;