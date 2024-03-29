import { useState, useEffect } from 'react';
import { auth } from '../Firebase/firebase';
import axios from 'axios';

function useConversations(deletedConversationId) {
  const [conversations, setConversations] = useState([]);

  const fetchConversations = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken(true);
      const response = await axios.get('https://api.docchat.in/api/conversations', {
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
    fetchConversations();
  }, [auth.currentUser, deletedConversationId]);
  return conversations;
}

export default useConversations;
