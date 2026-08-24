import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, Music } from "lucide-react";
import { toast } from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const data = await login(email, password);

      toast.success(data.message);

      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-card glass"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="auth-logo"
          animate={{ rotate: [0, 3, -3, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        >
          <Music size={30} />
        </motion.div>

        <h1>SARGAM</h1>

        <p className="auth-tagline">
          Old Soul. Endless Music.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <Mail size={19} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-box">
            <Lock size={19} />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          <motion.button
            className="auth-submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            disabled={submitting}
          >
            {submitting ? "Entering..." : "Enter SARGAM"}
          </motion.button>
        </form>

        <p className="auth-switch">
          New here?{" "}
          <Link to="/register">
            Create your account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;