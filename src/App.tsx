import React from 'react';
import { Header } from "./components/header/header";
import { Main } from "./pages/main";
import { Box } from '@mui/material';



function App() {
  return (
    <Box className="App">
      <Header />
      <Main/>
    </Box>
  );
}

export default App;
