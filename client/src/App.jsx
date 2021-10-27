import React from 'react';
import { createTheme } from '@mui/material';

import Chat from './chat/Chat';
import { ThemeProvider } from '@mui/styles';

const theme = createTheme({
	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			md: 900,
			lg: 1200,
			xl: 1536,
		},
	},
});

const App = () => {
	return (
		<ThemeProvider theme={theme}>
			<Chat />
		</ThemeProvider>
	);
};

export default App;
