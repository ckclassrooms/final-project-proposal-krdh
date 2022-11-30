import React from 'react'
import './Bench.css';

import {useState, useRef} from 'react';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';

import { useCollectionData } from 'react-firebase-hooks/firestore';

const auth = firebase.auth();
const firestore = firebase.firestore();

function BenchPressChatRoom() {

    function ChatRoom() {

        const dummy = useRef();

        const messagesRef = firestore.collection('benchPressMessages');
        const query = messagesRef.orderBy('createdAt').limit(25);

        const [messages] = useCollectionData(query, { idField: 'id' });

        const [formWeight, setFormWeight] = useState('');
        const [formReps, setFormReps] = useState('');

        const sendMessage = async (e) => {
            e.preventDefault();
            const { uid } = auth.currentUser;

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

        return (<>
            <div>
                {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
                <div ref={dummy}></div>
            </div>

            <div>-</div>
            <div>-</div>
            <div>-</div>
            <div>-</div>

            <form id="benchForm" onSubmit={sendMessage}>
                <input value={formWeight} onChange={(e) => setFormWeight(e.target.value)} placeholder="Enter Weight:" />
                <input value={formReps} onChange={(e) => setFormReps(e.target.value)} placeholder="Enter Reps:" />
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

