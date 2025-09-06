import "./App.css";
import ReCAPTCHA from "react-google-recaptcha";
import React, { useEffect, useState } from "react";
import { useToast } from "./Components/ToastProvider";

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

function App() {
  const [page, setPage] = useState("login");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [captcha, setCaptcha] = useState("");
  const [employs, setEmploys] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", designation: "", department: "", salary: "" });
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (token) {
      setPage("employ");
      fetchEmploys();
    }
  }, [token]);

  const handleCaptcha = (value) => {
    setCaptcha(value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
   if(!captcha){showToast("Please complete captcha","error");return}

    try {
      const res = await fetch("http://localhost:8080/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, captcha }),
      });
      if (res.ok) {
        showToast("Admin registered successfully!","success");
        setPage("login");
        setPassword("");
      } else {
        showToast("Failed to register (check captcha or credentials)!","error");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if(!captcha){showToast("Please complete captcha!","error");return}

    try {
      const res = await fetch("http://localhost:8080/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, captcha}),
      });
      if (res.ok) {
        const jwt = await res.text();
        localStorage.setItem("token", jwt);

        const payload = JSON.parse(atob(jwt.split(".")[1]));
        const loggedUser = payload.sub;
        localStorage.setItem("username", loggedUser);

        setToken(jwt);
        setUsername(loggedUser);
        setPage("employ");
        fetchEmploys();
        showToast("Logged in successfully!","success");
      } else {
        const errorMsg = await res.text();
        showToast(errorMsg||"Invalid credentials or captcha failed!","error");
      }
    } catch (err) {
      console.error("Login failed!", err);
    }
  };

  const logout = () => {
    setToken("");
    setUsername("");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setPage("login");
    setEmploys([]);
    setPassword("");
    showToast("Logged out successfully!","success");
  };

  const fetchEmploys = async () => {
    if (!token) return;
    const res = await fetch("http://localhost:8080/get-all-employs", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setEmploys(await res.json());
    } else if (res.status === 401) {
      logout();
    }
  };

  const handleAddEmploy = async (e) => {
    e.preventDefault();
    const url = editId
      ? `http://localhost:8080/update-employ/${editId}`
      : "http://localhost:8080/add-employ";
    const res = await fetch(url, {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ name: "", email: "", designation: "", department: "", salary: "" });
      setEditId(null);
      fetchEmploys();
      showToast(editId?"Employ updated!":"Employ added!","success");
    } else {
      showToast("Failed to add/update employ!","error");
    }
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8080/delete-employ/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchEmploys();
    showToast("Employ deleted!","info");
  };

  const handleEdit = (emp) => {
    setForm(emp);
    setEditId(emp.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast("Editing employ...!","info");
  };

  const handleSearch = async () => {
    if (!search) return fetchEmploys();
    const res = await fetch(`http://localhost:8080/search/${search}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setEmploys(await res.json());
      showToast("Search results found!","info");
    }
  };

  // ---------------- Register Page ----------------
  if (page === "register") {
    return (
      <div style={centerStyle}>
        <div style={cardStyle}>
          <h2 style={titleStyle}>Admin Register.</h2>
          <form onSubmit={handleRegister} style={formStyle}>
            <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <ReCAPTCHA sitekey="6Ld_A8ArAAAAAP7sv83jAB_jmSllIWOqkuJv4W5f" onChange={handleCaptcha} />
            <button type="submit">Register</button>
          </form>
          <p style={linkText}>
            already have an account?{" "}
            <span onClick={() => setPage("login")} style={linkStyle}>
              Login
            </span>
          </p>
        </div>
      </div>
    );
  }

  // ---------------- Login Page ----------------
  if (page === "login") {
    return (
      <div style={centerStyle}>
        <div style={cardStyle}>
          <h2 style={titleStyle}>Admin Login.</h2>
          <form onSubmit={handleLogin} style={formStyle}>
            <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <ReCAPTCHA sitekey={siteKey} onChange={(value) => setCaptcha(value)} />
            <button type="submit">Login</button>
          </form>
          <p style={linkText}>
            don't have an account?{" "}
            <span onClick={() => setPage("register")} style={linkStyle}>
              register
            </span>
          </p>
        </div>
      </div>
    );
  }

  // ---------------- Employ Page ----------------
  // ---------------- Employ Page ----------------
if (page === "employ") {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div style={{ flex: "1", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ padding: "50px", border: "1px solid #ddd", borderRadius: "8px", width: "65%" }}>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Employ Management System</h2>

          {/* Welcome User with Green Dot */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
              <div style={{ position: "relative", display: "inline-block" }}>
                <span>
                  Welcome,{" "}
                  <p style={{ display: "inline", fontWeight: "bold", margin: 0 }}>
                    @{username}
                  </p>
                </span>
                <span
                  style={{
                    position: "absolute",
                    top: "-3px",
                    right: "-10px",
                    width: "5px",
                    height: "5px",
                    backgroundColor: "green",
                    borderRadius: "50%",
                    border: "2px solid white",
                    boxShadow: "0 0 0 0 rgba(75, 241, 75, 0.7)",
                    animation: "pulse 1.5s infinite",
                  }}
                />
              </div>
            </div>
            <div style={{ marginTop: "10px" }}>
              <button onClick={logout}>Logout</button>
            </div>
          </div>

          {/* Pulse Animation */}
          <style>
            {`
              @keyframes pulse {
                0% {
                  transform: scale(0.9);
                  box-shadow: 0 0 0 0 rgba(38, 226, 38, 0.7);
                }
                70% {
                  transform: scale(1);
                  box-shadow: 0 0 0 8px rgba(0, 128, 0, 0);
                }
                100% {
                  transform: scale(0.9);
                  box-shadow: 0 0 0 0 rgba(0, 128, 0, 0);
                }
              }
            `}
          </style>

          {/* Add / Update Employ Form */}
          <form
            onSubmit={handleAddEmploy}
            style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap", justifyContent: "center" }}
          >
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input placeholder="Designation" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
            <input placeholder="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            <input placeholder="Salary" type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
            <button type="submit">{editId ? "Update" : "Add"} Employ</button>
          </form>

          {/* Search & Reset */}
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
            <input placeholder="Search keyword" value={search} onChange={(e) => setSearch(e.target.value)} />
            <button onClick={handleSearch}>Search</button>
            <button onClick={fetchEmploys}>Reset</button>
          </div>

          {/* Employs Table */}
          <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Designation</th>
                <th>Department</th>
                <th>Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employs.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.designation}</td>
                  <td>{emp.department}</td>
                  <td>{emp.salary}</td>
                  <td>
                    <button style={{ marginRight: "4px" }} onClick={() => handleEdit(emp)}>Edit</button>
                    <button onClick={() => handleDelete(emp.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <footer style={{ textAlign: "center", padding: "10px" }}>
        Created by -{" "}
        <a href="https://github.com/debapriyo007" target="_blank" rel="noreferrer" style={{ color: "blue", textDecoration: "underline" }}>
          @debu21🌱
        </a>
      </footer>
    </div>
  );
}

}

// ---------------- Reusable Styles ----------------
const centerStyle = { display: "flex", height: "100vh", justifyContent: "center", alignItems: "center" };
const cardStyle = { border: "1px solid #ddd", borderRadius: "8px", padding: "30px", width: "300px" };
const formStyle = { display: "flex", flexDirection: "column", gap: "10px" };
const titleStyle = { textAlign: "center", textTransform: "", fontSize: "25px", marginBottom: "20px" };
const linkText = { marginTop: "10px", textAlign: "center", fontSize: "13px" };
const linkStyle = { color: "blue", cursor: "pointer", textDecoration: "underline" };

export default App;
