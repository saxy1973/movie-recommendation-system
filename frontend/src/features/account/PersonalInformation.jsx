import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./PersonalInformation.css";

const PersonalInformation = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  // =========================================
  // PASSWORD MODAL
  // =========================================

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

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

    let loggedInUser;

    try {
      loggedInUser = JSON.parse(storedUser);
    } catch (error) {
      console.error("Stored User Parse Error:", error);

      localStorage.removeItem("user");
      sessionStorage.removeItem("user");

      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await api.get(
          `/auth/profile/${loggedInUser.id}`
        );

        console.log("Profile from DB:", response.data);

        if (response.data?.success && response.data?.user) {
          const profile = response.data.user;

          setUser(profile);

          setFormData({
            firstName: profile.firstName || "",
            lastName: profile.lastName || "",
            dob: profile.dob
              ? profile.dob.split("T")[0]
              : "",
            email: profile.email || "",
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Profile Fetch Error:", error);

        if (
          error.response?.status === 401 ||
          error.response?.status === 404
        ) {
          setUser(null);
        }
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
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

      if (!storedUser) {
        navigate("/login");
        return;
      }

      const loggedInUser = JSON.parse(storedUser);

      const response = await api.put(
        `/auth/profile/${loggedInUser.id}`,
        formData
      );

      console.log("Updated Profile:", response.data);

      if (response.data?.success && response.data?.user) {
        const updatedUser = response.data.user;

        setUser(updatedUser);

        setFormData({
          firstName: updatedUser.firstName || "",
          lastName: updatedUser.lastName || "",
          dob: updatedUser.dob
            ? updatedUser.dob.split("T")[0]
            : "",
          email: updatedUser.email || "",
        });

        setEditing(false);

        // Update stored user
        const updatedStoredUser = JSON.stringify({
          ...loggedInUser,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          dob: updatedUser.dob,
        });

        if (localStorage.getItem("user")) {
          localStorage.setItem("user", updatedStoredUser);
        } else {
          sessionStorage.setItem(
            "user",
            updatedStoredUser
          );
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
    if (!user) return;

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

  // =========================================
  // OPEN PASSWORD MODAL
  // =========================================

  const openPasswordModal = () => {
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordModal(true);
  };

  // =========================================
  // CLOSE PASSWORD MODAL
  // =========================================

  const closePasswordModal = () => {
    if (passwordLoading) return;

    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordModal(false);
  };

  // =========================================
  // PASSWORD CHANGE
  // =========================================

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      alert("Please fill both password fields.");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setPasswordLoading(true);

      const storedUser =
        localStorage.getItem("user") ||
        sessionStorage.getItem("user");

      if (!storedUser) {
        navigate("/login");
        return;
      }

      const loggedInUser = JSON.parse(storedUser);

      const response = await api.put(
        `/auth/change-password/${loggedInUser.id}`,
        {
          password: newPassword,
        }
      );

      console.log(
        "Password Change Response:",
        response.data
      );

      if (response.data?.success) {
        alert("Password changed successfully!");

        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordModal(false);
      }
    } catch (error) {
      console.error(
        "Password Change Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to change password."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="personal-page">
        <div className="personal-loading">
          <h2>Loading your profile...</h2>

          <p>
            Please wait while we fetch your personal
            information.
          </p>
        </div>
      </div>
    );
  }

  // =========================================
  // USER NOT FOUND
  // =========================================

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

  // =========================================
  // MAIN PAGE
  // =========================================

  return (
    <div className="personal-page">

      {/* =================================
          HEADER
      ================================= */}

      <div className="personal-header">
        <h1>Personal Information</h1>

        <p>
          Manage your personal details
        </p>
      </div>

      {/* =================================
          MAIN CARD
      ================================= */}

      <div className="personal-card">

        {/* =================================
            PROFILE
        ================================= */}

        <div className="personal-profile">

          <div className="personal-avatar">
            👤
          </div>

          <div>
            <h2>
              {user.firstName || ""}{" "}
              {user.lastName || ""}
            </h2>

            <p>
              Movira Member 🎬
            </p>
          </div>

        </div>

        {/* =================================
            INFORMATION GRID
        ================================= */}

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
                autoComplete="given-name"
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
                autoComplete="family-name"
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
                autoComplete="email"
              />
            ) : (
              <strong>
                {user.email || "N/A"}
              </strong>
            )}

          </div>

          {/* DATE OF BIRTH */}

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
                  ? new Date(
                      user.dob
                    ).toLocaleDateString("en-IN")
                  : "N/A"}
              </strong>
            )}

          </div>

        </div>

        {/* =================================
            PASSWORD
        ================================= */}

        <div className="password-section">

          <h3>Password</h3>

          <form
            className="password-row"
            onSubmit={(e) => e.preventDefault()}
          >

            <input
              type="password"
              value="••••••••"
              readOnly
              aria-label="Password"
              autoComplete="current-password"
            />

            <button
              type="button"
              onClick={openPasswordModal}
            >
              Change
            </button>

          </form>

          <p>
            Your password is securely protected.
          </p>

        </div>

        {/* =================================
            BUTTONS
        ================================= */}

        {!editing ? (

          <button
            type="button"
            className="edit-profile-btn"
            onClick={handleEdit}
          >
            ✏️ Edit Information
          </button>

        ) : (

          <div className="edit-buttons">

            <button
              type="button"
              className="save-profile-btn"
              onClick={handleSave}
            >
              ✓ Save Changes
            </button>

            <button
              type="button"
              className="cancel-profile-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>

          </div>

        )}

        {/* =================================
            CHANGE PASSWORD MODAL
        ================================= */}

        {showPasswordModal && (

          <div
            className="password-modal-overlay"
            onClick={closePasswordModal}
          >

            <div
              className="password-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* CLOSE */}

              <button
                type="button"
                className="password-modal-close"
                onClick={closePasswordModal}
                disabled={passwordLoading}
                aria-label="Close"
              >
                ×
              </button>

              {/* TITLE */}

              <h2>
                Change Password
              </h2>

              <p className="password-modal-subtitle">
                Create a new password for your
                Movira account.
              </p>

              {/* FORM */}

              <form
                onSubmit={handlePasswordChange}
              >

                {/* NEW PASSWORD */}

                <div className="password-input-group">

                  <label htmlFor="newPassword">
                    New Password
                  </label>

                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(
                        e.target.value
                      )
                    }
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />

                </div>

                {/* RETYPE PASSWORD */}

                <div className="password-input-group">

                  <label htmlFor="confirmPassword">
                    Retype Password
                  </label>

                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder="Retype new password"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />

                </div>

                {/* PASSWORD MATCH MESSAGE */}

                {confirmPassword &&
                  newPassword !==
                    confirmPassword && (
                    <p className="password-error">
                      Passwords do not match.
                    </p>
                  )}

                {confirmPassword &&
                  newPassword ===
                    confirmPassword && (
                    <p className="password-success">
                      Passwords match ✓
                    </p>
                  )}

                {/* CONFIRM */}

                <button
                  type="submit"
                  className="confirm-password-btn"
                  disabled={passwordLoading}
                >
                  {passwordLoading
                    ? "Changing..."
                    : "Confirm Change"}
                </button>

              </form>

            </div>

          </div>

        )}

      </div>

    </div>
  );
};

export default PersonalInformation;