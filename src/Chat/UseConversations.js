import { useState, useEffect } from 'react';
import { auth, db } from '../Firebase/firebase';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';

function useConversations() {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      if (auth.currentUser) {
        const conversationsRef = collection(db, 'users', auth.currentUser.uid, 'conversations');
        const conversationsSnapshot = await getDocs(conversationsRef);
        const conversationsData = conversationsSnapshot.docs.map(doc => {
          return { id: doc.id, fileName: doc.data().fileName };
        });
  
        const conversationsWithLatestMessage = [];
        for (const conversation of conversationsData) {
          const messagesRef = collection(conversationsRef, conversation.id, 'messages');
          const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));
          const lastMessageSnapshot = await getDocs(q);
          const lastMessage = lastMessageSnapshot.docs[0].data();
  
          conversationsWithLatestMessage.push({
            id: conversation.id,
            fileName: conversation.fileName,
            latestMessage: {
              text: lastMessage.text,
              sender: lastMessage.sender,
              timestamp: new Date(lastMessage.timestamp),
            },
          });
        }
        console.log(conversationsWithLatestMessage)
        const sortedConversations = conversationsWithLatestMessage.sort((a, b) => {
            return b.latestMessage.timestamp.getTime() - a.latestMessage.timestamp.getTime();
          });
        setConversations(sortedConversations);
      }
    };
  
    fetchConversations();
  }, [auth.currentUser]);

  return conversations;
}

export default useConversations;
