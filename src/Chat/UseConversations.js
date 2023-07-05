import { useState, useEffect } from 'react';
import { auth, db } from '../Firebase/firebase';
import axios from 'axios';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';

function useConversations(deletedConversationId) {
  const [conversations, setConversations] = useState([]);

  const fetchConversations = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken(true);
      const response = await axios.get('http://127.0.0.1:5000/api/conversations', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + idToken
        },
      });
      setConversations(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    // const fetchConversations = async () => {
    //   if (auth.currentUser) {
    //     const conversationsRef = collection(db, 'users', auth.currentUser.uid, 'conversations');
    //     const conversationsSnapshot = await getDocs(conversationsRef);
    //     const conversationsData = conversationsSnapshot.docs.map(doc => {
    //       return { id: doc.id, fileName: doc.data().fileName };
    //     });
  
    //     const conversationsWithLatestMessage = [];
    //     for (const conversation of conversationsData) {
    //       console.log(conversation)
    //       const messagesRef = collection(conversationsRef, conversation.id, 'messages');
    //       const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));
    //       const lastMessageSnapshot = await getDocs(q);
    //       const lastMessage = lastMessageSnapshot.docs[0].data();
  
    //       conversationsWithLatestMessage.push({
    //         id: conversation.id,
    //         fileName: conversation.fileName,
    //         latestMessage: {
    //           text: lastMessage.text,
    //           sender: lastMessage.sender,
    //           timestamp: new Date(lastMessage.timestamp['seconds']*1000),
    //         },
    //       });
    //     }
    //     const sortedConversations = conversationsWithLatestMessage.sort((a, b) => {
    //       return new Date(b.latestMessage.timestamp['seconds']*1000) - new Date(a.latestMessage.timestamp['seconds']*1000);
    //     });
    //     setConversations(sortedConversations);
    //   }
    // };
  
    fetchConversations();
  }, [auth.currentUser, deletedConversationId]);
  return conversations;
}

export default useConversations;
