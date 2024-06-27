import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useContext, useState } from "react";
import { auth, db } from "../Firebase/Firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './loginRegister.css';
import {createUser} from '../Api/Api'
import { Question } from "../../context/QuestionContext";


function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");

  const {
    quiz,
    setQuiz,
  } = useContext(Question);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      // setAccount(user)
      console.log(user);
      // if (user) {
      //   await setDoc(doc(db, "Users", user.uid), {
      //     email: user.email,
      //     firstName: fname,
      //     lastName: lname,
      //   });
      // }
      if(user){
        const userData = {
          uid: user.uid,
          mail: user.email,
          firstName: fname,
          lastName: lname,
        };

      const dataRecieved=  await createUser(userData);
      console.log(dataRecieved);
      }

      setQuiz(prevQuiz => ({
        ...prevQuiz,
        creatorId: user.uid,
      }));

      console.log("User Registered Successfully");
      toast.success("User Registered Successfully", {
        position: "top-center",
      });
      // Clear the input fields
      setEmail("");
      setPassword("");
      setFname("");
      setLname("");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form className="login-form" onSubmit={handleRegister}>
        <h3>Sign Up</h3>

        <div className="mb-3">
          <label>First name</label>
          <input
            type="text"
            className="form-control"
            placeholder="First name"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Last name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Last name"
            value={lname}
            onChange={(e) => setLname(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Sign Up
          </button>
        </div>
        <p className="forgot-password">
          Already registered?<br /> <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}

export default Register;
