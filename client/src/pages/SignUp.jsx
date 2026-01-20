import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormDate] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigte = useNavigate();

  const handleChange = (e) => {
    setFormDate({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      setLoading(false);
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data);
        return;
      }
      setLoading(false);
      setError(false);
      navigte("/sign-in");
    } catch (error) {
      setError(data);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="font-semibold text-3xl my-7 text-center">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          id="username"
          className="p-3 rounded-lg focus:outline-none border"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="p-3 rounded-lg focus:outline-none border"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="p-3 rounded-lg focus:outline-none border"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-800 text-white uppercase rounded-lg p-3 hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth />
      </form>
      <div className="mt-5 flex gap-2">
        <span>Have an account?</span>
        <Link to={"/sign-in"}>
          <span className="text-blue-700">Sign In</span>
        </Link>
      </div>
      <p className="mt-4 text-red-700">{error ? error.message : ""}</p>
    </div>
  );
}
