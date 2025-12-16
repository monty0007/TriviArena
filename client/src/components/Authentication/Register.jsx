import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useContext, useState } from "react";
import { auth } from "../Firebase/Firebase";
import { toast } from 'react-toastify';
import { createUser } from '../Api/Api'
import { Question } from "../../context/QuestionContext";
import { Link } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");

  const { setQuiz } = useContext(Question);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user);

      if (user) {
        const userData = {
          uid: user.uid,
          mail: user.email,
          firstName: fname,
          lastName: lname,
        };

        const dataRecieved = await createUser(userData);
        console.log(dataRecieved);
      }

      setQuiz(prevQuiz => ({
        ...prevQuiz,
        creatorId: user.uid,
      }));

      console.log("User Registered Successfully");
      toast.success("User Registered Successfully", { position: "top-center" });
      setEmail("");
      setPassword("");
      setFname("");
      setLname("");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, { position: "bottom-center" });
    }
  };

  return (
    <div className="min-h-screen bg-[#2563eb] flex items-center justify-center p-4 overflow-hidden relative font-sans">
      {/* Navigation - Top Left Back Button */}
      <nav className="absolute top-0 left-0 w-full p-6 z-20 flex justify-start items-center pointer-events-none">
        <Link to="/" className="pointer-events-auto text-white hover:bg-white/10 px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 border border-transparent hover:border-white/20">
          <span>←</span> Back
        </Link>
      </nav>
      {/* Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-24 h-24 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-[20%] right-[5%] w-32 h-32 bg-white/10 rounded-lg transform rotate-45 animate-float"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-xl shadow-card p-8 md:p-10 z-10 relative">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-500 font-bold">Join the fun!</p>
        </div>

        <form className="space-y-4" onSubmit={handleRegister}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                className="w-full bg-gray-100 border-2 border-transparent text-gray-800 rounded px-4 py-3 focus:outline-none focus:bg-white focus:border-gray-300 transition-all font-medium"
                placeholder="John"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                className="w-full bg-gray-100 border-2 border-transparent text-gray-800 rounded px-4 py-3 focus:outline-none focus:bg-white focus:border-gray-300 transition-all font-medium"
                placeholder="Doe"
                value={lname}
                onChange={(e) => setLname(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full bg-gray-100 border-2 border-transparent text-gray-800 rounded px-4 py-3 focus:outline-none focus:bg-white focus:border-gray-300 transition-all font-medium"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full bg-gray-100 border-2 border-transparent text-gray-800 rounded px-4 py-3 focus:outline-none focus:bg-white focus:border-gray-300 transition-all font-medium"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded shadow-button active:shadow-button-active active:translate-y-1 transition-all mt-4"
          >
            Sign Up
          </button>

          <p className="text-center text-gray-500 text-sm mt-6 font-medium">
            Already have an account? <Link to="/login" className="text-blue-600 hover:underline font-bold">Log In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
