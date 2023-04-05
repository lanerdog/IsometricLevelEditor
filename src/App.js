import React from 'react';
import { Editor } from './components/editor';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
})

function App() {

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Editor />
    </ThemeProvider>
  );
}

export default App;
