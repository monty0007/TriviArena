import React, { useContext, useEffect, useState } from 'react'
import { auth, db } from '../Firebase/Firebase'
import { getDoc, doc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import Navbar from '../Create/Navbar'
import './Dashboard.css'
import { getUser } from '../Api/Api'
import { AccountContext } from '../context/AccountProvider'

function Dashboard() {
  const { account } = useContext(AccountContext);
  const [userDetails, setUserDetails] = useState(null)
  const navigate = useNavigate()

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      
      console.log(user)
      setUserDetails(user)
      // const docRef = doc(db, 'Users', user.uid)
      // const docSnap = await getDoc(docRef)
      // if (docSnap.exists()) {
        // setUserDetails(docSnap.data())
        // console.log(docSnap.data())
      //   const dataRecieved=  await getUser(account._id); 
      //   if(dataRecieved.exist()){
      //     setUserDetails(dataRecieved.data())
      // } else {
      //   console.log('User is not logged in')
      //   // handleLogout()
      //   // navigate('/login')
      // }
    })
  }
  useEffect(() => {
    fetchUserData()
  }, [])

  async function handleLogout() {
    try {
      await auth.signOut()
      navigate('/login')
      console.log('User logged out succesfully')
    } catch (error) {
      console.log('Error logging out : ', error.message)
    }
  }

  const handleCreate = async () => {
    navigate('/create')
  }
  return (
    <div>
      <Navbar />
      <div className="dashboard">
        {userDetails ? (
          <>
            <h3>Welcome {userDetails.firstName || userDetails.displayname} {userDetails.lastName}  🙏🙏</h3>
            <div>
              <p>Email: {userDetails.email}</p>
              <p>First Name: {userDetails.firstName}</p>
              <p>Last Name: {userDetails.lastName}</p>
            </div>
            <div className="dashboard-button">
              <button className="btn btn-primary " onClick={handleCreate}>
                Create
              </button>
              <button className="btn btn-primary" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  )
}
export default Dashboard
