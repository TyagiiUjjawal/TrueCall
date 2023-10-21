import React from 'react';
import {AuthProvider} from './Components/AuthContext'; // Import the AuthProvider

import Navigation from './Components/Navigation';

const App = () => {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
};

export default App;
