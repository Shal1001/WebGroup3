import React from 'react';
import {useAuthState} from '../Context';

const Dashboard = (props) => {
  const userDetails = useAuthState();

  return (
    <div>
      <h1>hello {userDetails.user.role} </h1>
    </div>
  );
};

export default Dashboard;
