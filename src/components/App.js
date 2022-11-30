import Signup from "./Signup";
import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react";
import Dashboard from "./Dashboard";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import PrivateRoute from "./PrivateRoute";
import BenchPress from "./BenchPress";
import Deadlift from "./Deadlift";
import Squat from "./Squat";
import BenchPressChatRoom from "./BenchPressChatRoom";
import {db} from '../firebase'
import { collection, getDocs, query, onSnapshot  } from 'firebase/firestore'
/* eslint-disable react-hooks/exhaustive-deps */


function App() {

  // - Local bench press state
  const [benchPressQueue, setBenchPressQueue] = useState([])
  const benchPressQueueCollectionRef = collection(db, "benchPressQueue")

  useEffect(() => {
    // - Load data on launch
    const getBenchPressQueue = async () => {
      const data = await getDocs(benchPressQueueCollectionRef)
      setBenchPressQueue(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
    }
    getBenchPressQueue()
  }, [])

  // - Set up live listening to Firebase
  useEffect(() => {
    // - Listen to benchPressQueue collection
    const q = query(collection(db, "benchPressQueue"));
    onSnapshot(q, (querySnapshot) => {
      const users = [];
      // - When there's a change to the snapshot ->
      querySnapshot.forEach((doc) => {
        users.push(doc.data().email);
      });
      console.log(users.join(", "));
      // - Load in new snapshot
      const getBenchPressQueue = async () => {
        const data = await getDocs(benchPressQueueCollectionRef)
        setBenchPressQueue(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
      }
      getBenchPressQueue()
      });
  }, [])

  return (
      <Container 
      className="d-flex align-items-center justify-content-center" 
      style = {{ minHeight: "100vh"}}
      >
        <div className="w-100" style={{ maxWidth: '400px'}}>
          <Router>
          <AuthProvider>
            <Routes>
              <Route exact path="/" element={<PrivateRoute> <Dashboard/> </PrivateRoute>} />
              <Route path='/signup' element={<Signup/>} />
              <Route path='/login' element={<Login/>} />
              <Route path='/benchpress' element={<BenchPress benchPressQueue = { benchPressQueue } setBenchPressQueue = { setBenchPressQueue }/>} />
              <Route path='/deadlift' element={<Deadlift/>} />
              <Route path='/squat' element={<Squat/>} />
              <Route path="/forgot-password" element={<ForgotPassword/>} />
              <Route path="/chat-room" element={<BenchPressChatRoom/>} />
            </Routes>
          </AuthProvider>
          </Router>
        </div>
      </Container>
  )
}

export default App;