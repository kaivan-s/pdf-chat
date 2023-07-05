import { render } from '@testing-library/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserSubscription } from '../Firebase/firebase';
import { auth } from '../Firebase/firebase';

export const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    async function protect() {
      const user = auth.currentUser;
      if (user) {
        const isSubscribed = await getUserSubscription(user);
        if (isSubscribed) {
          render()
        }
        else {navigate('/')}
      } else {
        navigate('/login');
      }
    }
    protect();
  }, [navigate]);

  // rest of your Dashboard component
};