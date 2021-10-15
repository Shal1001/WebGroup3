import React from 'react';
import {Redirect, Route} from 'react-router-dom';

import {useAuthState} from '../Context';

const AppRoutes = ({component: Component, path, isPrivate}) => {
  const userDetails = useAuthState();
  if (isPrivate && !Boolean(userDetails.user)) {
    return <Redirect to={{pathname: '/login'}} />;
  } else if (!isPrivate && Boolean(userDetails.user)) {
    return <Redirect to={{pathname: `/dashboard`}} />;
  } else {
    return <Route path={path} component={Component} />;
  }
};

export default AppRoutes;
