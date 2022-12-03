import React from 'react'
import './Bench.css';
import { collection, doc, deleteDoc, updateDoc, increment, getDocs, setDoc, onSnapshot } from "firebase/firestore";
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

    const benchPressChatRoomRef = collection(db, "benchPressChatRoom"); 
    // const benchPressMessagesRef = collection(db, "benchPressMessages"); 

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

        const [buttonDisabled, setButtonDisabled] = useState(false);

        const sendMessage = async (e) => {
            e.preventDefault();
            const { uid } = auth.currentUser;

            if ((!isNaN(formWeight) && !isNaN(formWeight) && formWeight.length !== 0 && formReps.length !== 0)) {
              // weight and reps are numbers
              await messagesRef.add({
                text: formWeight + " lbs" + " X " + formReps + " reps",
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                uid
              })
          
              setFormWeight('');
              setFormReps('');
              dummy.current.scrollIntoView({ behavior: 'smooth' });

              // - Update score
              const userRef = doc(db, "benchPressChatRoom", auth.currentUser.email);
              await updateDoc(userRef, {
                score: increment(formWeight * formReps),
                messagesSent: increment(1)
              });
              const data = await getDocs(benchPressChatRoomRef)
              // - Get all users in the bench press queue
              const users = data.docs.map((doc) => ({...doc.data(), id: doc.id}))
              // - Increment messages sent counter 
              if (users[0].email === auth.currentUser.email) {
                if (users[0].messagesSent === 4) {
                  setButtonDisabled(true)
                }
              } else {
                if (users[1].messagesSent === 4) {
                  setButtonDisabled(true)
                }
              }

              // - If both users are done
              if (users[0].messagesSent === 4 && users[1].messagesSent === 4) {
                if (users[0].score > users[1].score) {
                  const ref = doc(db, 'benchPressChatRoom', users[0].email);
                  setDoc(ref, { won: true }, { merge: true });
                } else {
                  const ref = doc(db, 'benchPressChatRoom', users[1].email);
                  setDoc(ref, { won: true }, { merge: true });
                }
                const ref1 = doc(db, 'benchPressChatRoom', users[0].email);
                setDoc(ref1, { score: -1 }, { merge: true });
                const ref2 = doc(db, 'benchPressChatRoom', users[1].email);
                setDoc(ref2, { score: -1 }, { merge: true });
              }
            }
        }

        const unsub = onSnapshot(doc(db, "benchPressChatRoom", "-"), async (doc) => {
          const data = await getDocs(benchPressChatRoomRef)
          const users = data.docs.map((doc) => ({...doc.data(), id: doc.id}))
          if (users[0].score === -1 && users[1].score === -1) {
            window.location.replace("http://localhost:3000/");
          }
          unsub()
      });

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
                <button disabled={buttonDisabled} type="submit">Send</button>
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
