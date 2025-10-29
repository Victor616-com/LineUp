"use client";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { UserAuth } from "../context/AuthContext";

const SignUp = () => {
  //User info states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [error, setError] = useState();
  const [loading, setLoading] = useState("");

  const { session, signUpNewUser } = UserAuth();

  const navigate = useNavigate();
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signUpNewUser(email, password, username);
      if (result.success) {
        navigate("/home");
      } else {
        setError(result.error.message);
      }
    } catch (err) {
      setError("An error occured during sign up.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSignup}
        className="max-w-md m-auto p-24 border border-black rounded-lg flex flex-col gap-m"
      >
        <h2 className="text-2xl">Sign Up!</h2>

        <div className="flex flex-col gap-xs">
          <label>Enter your username</label>
          <input
            className="border-black rounded border"
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="email">Enter your email</label>
          <input
            className="border-black rounded border"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Enter your password</label>
          <input
            className="border-black rounded border"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="bg-yellow w-fit px-xs py-xxs rounded-medium cursor-pointer"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        <p>
          Already have an account?{" "}
          <Link className="text-blue-500" to="/signin">
            Sign in
          </Link>
        </p>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default SignUp;
