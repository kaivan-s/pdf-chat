import React from "react";
import { Route, Navigate } from "react-router-dom";
import { db, auth } from '../Firebase/firebase'
import { useEffect, useState } from "react";
import { getUserSubscription } from "../Firebase/firebase";
import { useLocation } from 'react-router-dom';

function ProtectedRoute({ element, ...rest }) {
  const user = auth.currentUser;
  const location = useLocation();
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchSubscription = async () => {
        const subscription = await getUserSubscription(user);
        setIsSubscribed(subscription);
      };
      fetchSubscription();
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  } else if (!isSubscribed) {
    return <Navigate to="/landing" state={{ from: location }} replace />;
  } else {
    return <Route element={element} {...rest} />;
  }
}

export default ProtectedRoute;

