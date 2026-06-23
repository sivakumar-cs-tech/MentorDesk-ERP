import { useEffect, useState } from "react";
import { Save, Upload, Moon, Sun, User, Lock } from "lucide-react";

import PageHeader from "../components/ui/PageHeader";
import "../styles/settings.css";

const STORAGE_KEY = "mentorDesk_settings";

const DEFAULT_SETTINGS = {
  instituteName: "MentorDesk Training Institute",
  logo: "",
  theme: "light",
  adminName: "Admin",
  adminEmail: "admin@mentordesk.com",
  adminPhone: "",
};

const loadSettings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
};

const Settings = () => {
  const [settings, setSettings] = useState(loadSettings);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", settings.theme);
  }, [settings.theme]);

  const updateField = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateField("logo", reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setMessage({ type: "success", text: "Settings saved successfully." });
    setTimeout(() => setMessage(null), 3000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirm) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }
    setMessage({ type: "success", text: "Password updated successfully." });
    setPasswordForm({ current: "", newPassword: "", confirm: "" });
  };

  const toggleTheme = () => {
    updateField("theme", settings.theme === "light" ? "dark" : "light");
  };

  return (
    <div className="settings-page">
      <PageHeader title="Settings" subtitle="Configure institute profile and preferences.">
        <button type="button" className="btn btn-primary" onClick={handleSave}>
          <Save size={18} /> Save Settings
        </button>
      </PageHeader>

      {message && (
        <div className={`alert-banner alert-${message.type === "error" ? "error" : "success"}`}>
          {message.text}
        </div>
      )}

      <div className="settings-grid">
        <div className="page-card settings-section">
          <h2>Institute Profile</h2>
          <div className="form-group">
            <label>Institute Name</label>
            <input
              value={settings.instituteName}
              onChange={(e) => updateField("instituteName", e.target.value)}
            />
          </div>

          <div className="form-group logo-upload-group">
            <label>Logo</label>
            <div className="logo-upload-area">
              {settings.logo ? (
                <img src={settings.logo} alt="Institute logo" className="logo-preview" />
              ) : (
                <div className="logo-placeholder">
                  <Upload size={24} />
                  <span>Upload logo</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="logo-input" />
            </div>
          </div>

          <div className="theme-toggle-row">
            <div>
              <h3>Theme</h3>
              <p>Switch between light and dark mode</p>
            </div>
            <button type="button" className="theme-toggle-btn" onClick={toggleTheme}>
              {settings.theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
              {settings.theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>
          </div>
        </div>

        <div className="page-card settings-section">
          <h2><User size={20} /> Admin Profile</h2>
          <div className="form-group">
            <label>Full Name</label>
            <input value={settings.adminName} onChange={(e) => updateField("adminName", e.target.value)} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={settings.adminEmail} onChange={(e) => updateField("adminEmail", e.target.value)} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input value={settings.adminPhone} onChange={(e) => updateField("adminPhone", e.target.value)} />
          </div>
        </div>

        <div className="page-card settings-section">
          <h2><Lock size={20} /> Change Password</h2>
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm((p) => ({ ...p, current: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }}>
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
