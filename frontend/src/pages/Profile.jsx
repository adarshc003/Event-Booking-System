import { useEffect, useState } from "react";
import API from "../services/api";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);

  const [form, setForm] = useState({
    phone: "",
    place: "",
    photo: null,
    photoPreview: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  // FETCH PROFILE
  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/profile");
      setProfile(res.data);
      setForm({
        phone: res.data.phone || "",
        place: res.data.place || "",
        photo: null,
        photoPreview: res.data.photo || "",
      });
    } catch (err) {
      setError("Session expired. Please login again.");
    }
  };

  // VALIDATION
  const validate = () => {
    const phoneRegex = /^[0-9]{10}$/;
    const placeRegex = /^[A-Za-z ]{2,}$/;

    if (form.phone && !phoneRegex.test(form.phone)) {
      setError("Phone number must contain exactly 10 digits");
      return false;
    }

    if (form.place && !placeRegex.test(form.place)) {
      setError("Place must contain only letters and spaces");
      return false;
    }

    return true;
  };

  // PHOTO HANDLER
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm({
      ...form,
      photo: file,
      photoPreview: URL.createObjectURL(file),
    });
  };

  // SAVE PROFILE
  const saveProfile = async () => {
    setError("");
    setSuccess("");

    if (!validate()) return;

    try {
      const res = await API.put("/auth/profile", {
        phone: form.phone,
        place: form.place,
      });

      setProfile(res.data);
      setEdit(false);
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  // LOADING 
  if (!profile) {
    return (
      <div className="page-wrapper">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      {/*  PROFILE VIEW  */}
      <div className="page-wrapper">
    

        <div className="container profile-view">
          {/* PROFILE PHOTO */}
          <div className="profile-photo">
            {form.photoPreview ? (
              <img src={form.photoPreview} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* PROFILE DETAILS */}
          <div className="profile-details">
            <div>
              <label>Name</label>
              <span>{profile.name}</span>
            </div>

            <div>
              <label>Email</label>
              <span>{profile.email}</span>
            </div>

            <div>
              <label>Phone</label>
              <span>{profile.phone || "Not added"}</span>
            </div>

            <div>
              <label>Place</label>
              <span>{profile.place || "Not added"}</span>
            </div>
          </div>

          {/* MESSAGES */}
          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}

          <button onClick={() => setEdit(true)}>Edit Profile</button>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {edit && (
        <div className="profile-modal-overlay">
          <div className="profile-modal">
            <h3>Edit Profile</h3>

            {error && <div className="error-msg">{error}</div>}

            {/* PHOTO EDIT */}
            <div className="edit-photo">
              {form.photoPreview ? (
                <img src={form.photoPreview} alt="Preview" />
              ) : (
                <div className="avatar-placeholder small">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              )}

              <label className="upload-btn">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handlePhotoChange}
                />
              </label>
            </div>

            <input
              type="text"
              placeholder="Phone (10 digits)"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Place (letters only)"
              value={form.place}
              onChange={(e) =>
                setForm({ ...form, place: e.target.value })
              }
            />

            <div className="profile-modal-actions">
              <button onClick={saveProfile}>Save</button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setEdit(false);
                  setError("");
                  setSuccess("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
