import React from "react"
import "firebase/database"
import { Button } from "react-bootstrap"
import { useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, doc, deleteDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import { Link } from "react-router-dom"

function BenchPress({benchPressQueue, setBenchPressQueue}) {

  const [newWeight, setNewWeight] = useState(0);
  const [newID, setNewID] = useState(0);
  const benchPressQueueCollectionRef = collection(db, "benchPressQueue"); 

  const addUserToQueue = async () => {
    firebase.auth().onAuthStateChanged(async function(user) {
      // - If user is authenticated
      console.log("ADDED")
      console.trace();
      if (user) {
        // - Get current user email
        var email = user.email;
        const data = await getDocs(benchPressQueueCollectionRef)
        // - Get all users in the bench press queue
        const users = data.docs.map((doc) => ({...doc.data(), id: doc.id}))
        const emails = []
        for (var i=0; i < users.length; i++) {
          emails.push(users[i].email)
        }
        // - If current user in queue, don't let them join
        if (emails.includes(email) === true) {
          // TO DO - ERROR HANDLE with POPUP 
          console.log("Already in queue")
        } else if ( newWeight <= 0) {
          // TO DO - ERROR HANDLE with POPUP 
          console.log("Weight class must be higher than 0")
        } else {
          // - If user not in queue and they enter a valid weight class, put them in the queue
          await addDoc(benchPressQueueCollectionRef, {email: email, weightClass: Number(newWeight) })
          .then(docRef => {
            // - Save current ID of user spot in queue
            setNewID(docRef.id)
          });
          const data = await getDocs(benchPressQueueCollectionRef)
          setBenchPressQueue(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
        }
      }
    });
  };

  const removeUserFromQueue = async () => {
    firebase.auth().onAuthStateChanged(async function(user) {
      // - If user is authenticated
      if (user) {
        // - Remove user from queue
        await deleteDoc(doc(db, "benchPressQueue", `${newID}`));
        const data = await getDocs(benchPressQueueCollectionRef)
        setBenchPressQueue(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
      }
  })};

  window.onpopstate = function(event) {
    // -  When user clicks backspace
    removeUserFromQueue();
    event.preventDefault();
  };

  window.onbeforeunload = function(event) {
    // -  When user clicks backspace
    removeUserFromQueue();
    event.preventDefault();
  };

    return (
      <div>
        <h2 className="text-center mb-4">Bench Press Competition</h2>

        <input className="text-center pr-4 w-100" type="number" placeholder="Weight Class" onChange={(event) => {setNewWeight(event.target.value);}}/>

        <Button onClick = {addUserToQueue} className="border border-success bg-success w-100 mb-4 mt-4" type="submit">
                Join
        </Button>
        <Button onClick = {removeUserFromQueue} className="border border-danger bg-danger w-100 mb-4" type="submit">
                Leave
        </Button>

        <h4 className="text-center mb-4">User Queue</h4>

        <div className="list-container w-100" >
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col"> </th>
            <th scope="col">Name</th>
            <th scope="col">Weight Class</th>
          </tr>
        </thead>
        <tbody id="main-table-body">
          {benchPressQueue.map((user) => {
            return (UserRow({"user": user}))
          })}
        </tbody>
      </table>
    </div>
      <div className="w-100 text-center mt-2"><Link to="/chat-room" className="text-success">Chat Room</Link>
      </div>
      </div>
)

function UserRow({user}) {
  // - Populate html list with every user 
  return (
    <tr className="user">
      <td></td>
      <td>{user.email}</td>
      <td>{user.weightClass}</td>
    </tr>
  );
}

}

export default BenchPress
