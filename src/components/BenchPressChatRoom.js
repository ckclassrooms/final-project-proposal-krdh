import React from 'react'
import './Bench.css';
import { collection, doc, deleteDoc } from "firebase/firestore";
import {useState, useRef} from 'react';
import { db } from "../firebase";

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';

import { useCollectionData } from 'react-firebase-hooks/firestore';

const auth = firebase.auth();
const firestore = firebase.firestore();

function BenchPressChatRoom() {

    const [totalWeightPushed, setTotalWeightPushed] = useState(0);
    const [oppWeightPushed, setOppTotalWeightPushed] = useState(0);

    const benchPressChatRoomRef = collection(db, "benchPressChatRoom"); 

    const removeUserFromQueue = async () => {
      firebase.auth().onAuthStateChanged(async function(user) {
        // - If user is authenticated
        if (user) {
          // - Remove user from queue
          await deleteDoc(doc(db, "benchPressChatRoom", user.email));
        }
    })};

    function ChatRoom() {

        const dummy = useRef();

        const messagesRef = firestore.collection('benchPressMessages');
        const query = messagesRef.orderBy('createdAt').limit(25);

        const [messages] = useCollectionData(query, { idField: 'id' });

        const [formWeight, setFormWeight] = useState('');
        const [formReps, setFormReps] = useState('');

        var email = ""
        firebase.auth().onAuthStateChanged((user) => {
            if (user) { // - User is signed in
              email = user.email
            } else {
              // User is signed out
            }
          });

        const sendMessage = async (e) => {
            e.preventDefault();
            const { uid } = auth.currentUser;

            if ((!isNaN(formWeight) && !isNaN(formWeight) && formWeight.length !== 0 && formReps.length !== 0)) {
              // weight and reps are numbers
              await messagesRef.add({
                text: email + " logged:",
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                uid
              })
              await messagesRef.add({
                text: formWeight + " lbs",
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                uid
              })
              await messagesRef.add({
                  text: formReps + " reps",
                  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                  uid
              })
              setFormWeight('');
              setFormReps('');
              dummy.current.scrollIntoView({ behavior: 'smooth' });
              }
        }

        return (<>
            <div>
            <center>
                <h5>Log your reps and weight. Who ever can push the most volume over 4 sets wins!</h5>
            </center>
            </div>
            <div>
                {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
                <div ref={dummy}></div>
            </div>

            <form id="benchForm" onSubmit={sendMessage}>
                <input id="benchField" value={formWeight} onChange={(e) => setFormWeight(e.target.value)} placeholder="Enter Weight:" />
                <input id="benchField" value={formReps} onChange={(e) => setFormReps(e.target.value)} placeholder="Enter Reps:" />
                <button type="submit">Send</button>
            </form>

          </>)
    }

    function ChatMessage(props) {
        const { text, uid } = props.message;

        const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
      
        return (<>
            <div className={`message ${messageClass}`}>
              <p>{text}</p>
            </div>
          </>)
      }
    
    return (
        <div>
            { <ChatRoom /> }
        </div>
      )

}

export default BenchPressChatRoom
