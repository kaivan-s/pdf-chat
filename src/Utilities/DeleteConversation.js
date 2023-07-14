import { doc, deleteDoc, getDocs, collection, query, where, limit } from "firebase/firestore";
import axios from "axios";
import { auth, db, storage } from "../Firebase/firebase";
import { deleteObject, ref } from "firebase/storage";

const deleteChat = async (fileName) => {

  if (auth.currentUser) {
    const conversationsRef = collection(db, "users", auth.currentUser.uid, "conversations");

    const conversationQuery = query(conversationsRef, where("fileName", "==", fileName), limit(1));
    const matchingConversations = await getDocs(conversationQuery);

    if (!matchingConversations.empty) {
      const conversationId = matchingConversations.docs[0].id;

      // Delete all messages in the conversation
      const messagesRef = collection(conversationsRef, conversationId, "messages");
      const messagesSnapshot = await getDocs(messagesRef);

      for (const messageDoc of messagesSnapshot.docs) {
        await deleteDoc(doc(messagesRef, messageDoc.id));
      }

      // Delete the conversation document
      const conversationRef = doc(conversationsRef, conversationId);

      const userId = auth.currentUser.uid;
      const fileRef = ref(storage, `pdfs/${userId}/${fileName}`);
      await deleteObject(fileRef);
      await deleteDoc(conversationRef);
      await axios.post('https://api.docchat.in/api/delete-conversation', { pdf_file: fileName.replace(/ /g, '_')});

      return true;
    }
  } else {
    console.error("User not logged in");
    return false;
  }
};

export default deleteChat;
