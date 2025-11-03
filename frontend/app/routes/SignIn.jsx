"use client";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { UserAuth } from "../context/AuthContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState();
  const [loading, setLoading] = useState("");

  const { signInUser } = UserAuth();
  const navigate = useNavigate();
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInUser(email, password);
      if (result.success) {
        navigate("/home");
      } else {
        setError(result.error.message);
      }
    } catch (err) {
      setError("An error occured during sign-in.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-dvh flex flex-col justify-center items-center px-4 py-6 overflow-auto">
      <form
        onSubmit={handleSignIn}
        className="max-w-md rounded-lg flex flex-col gap-m"
      >
        <h2 className="text-2xl">Sign In!</h2>

        <div className="flex flex-col gap-xs">
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
          Sign In
        </button>
        <p>
          Don't have have an account?{" "}
          <Link className="text-blue-500" to="/signup">
            Sign up
          </Link>
        </p>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default SignIn;
