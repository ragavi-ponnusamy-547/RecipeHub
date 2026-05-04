import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    profilePic: user?.profilePic || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((current) => ({ ...current, [name]: value }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setSavingProfile(true);
    setProfileError('');
    setProfileMessage('');

    try {
      await updateProfile(profileForm);
      setProfileMessage('Profile updated successfully');
    } catch (requestError) {
      setProfileError(requestError.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setSavingPassword(true);
    setPasswordError('');
    setPasswordMessage('');

    try {
      await changePassword(passwordForm);
      setPasswordMessage('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (requestError) {
      setPasswordError(requestError.message);
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="page-shell profile-shell">
      <section className="hero-card compact">
        <div>
          <p className="eyebrow">Profile Settings</p>
          <h1>Edit your account</h1>
          <p className="hero-copy">Update your name, username, email, profile picture, and change your password securely.</p>
        </div>
      </section>

      <div className="detail-grid">
        <form className="auth-card" onSubmit={handleProfileSubmit}>
          <h2>Profile Info</h2>
          <label>
            Name
            <input type="text" name="name" value={profileForm.name} onChange={handleProfileChange} required />
          </label>
          <label>
            Username
            <input type="text" name="username" value={profileForm.username} onChange={handleProfileChange} required />
          </label>
          <label>
            Email
            <input type="email" name="email" value={profileForm.email} onChange={handleProfileChange} required />
          </label>
          <label>
            Profile picture URL
            <input type="url" name="profilePic" value={profileForm.profilePic} onChange={handleProfileChange} />
          </label>
          {profileError ? <p className="form-error">{profileError}</p> : null}
          {profileMessage ? <p className="form-success">{profileMessage}</p> : null}
          <button className="primary-button full-width" type="submit" disabled={savingProfile}>
            {savingProfile ? 'Saving...' : 'Save Profile'}
          </button>
        </form>

        <form className="auth-card" onSubmit={handlePasswordSubmit}>
          <h2>Change Password</h2>
          <label>
            Current password
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </label>
          <label>
            New password
            <input type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} required />
          </label>
          <label>
            Confirm new password
            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
          </label>
          {passwordError ? <p className="form-error">{passwordError}</p> : null}
          {passwordMessage ? <p className="form-success">{passwordMessage}</p> : null}
          <button className="primary-button full-width" type="submit" disabled={savingPassword}>
            {savingPassword ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;