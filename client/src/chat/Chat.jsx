import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useSubscription, gql, useMutation } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { Container, Grid, Typography, Box, TextField, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
	mainContainer: {
		backgroundColor: '#eee',
		minHeight: '100vh',
		height: '100%',
	},
	messagesContainer: {
		overflowY: 'scroll',
		height: 'calc(100vh - 100px)',
		[theme.breakpoints.down('md')]: {
			height: 'calc(100vh - 150px)',
		},
	},
	messagesWrapper: {
		flexDirection: 'column !important',
		width: '100% !important',
		paddingTop: 25,
		margin: '0 !important',
		// height: 'calc(100vh - 100px)',
		// display: 'flex',
		// flexDirection: 'column-reverse',
	},
	message: {
		display: 'flex',
	},
	messageUserIcon: {
		borderRadius: 50,
		backgroundColor: '#ccc',
		width: '50px',
		height: '50px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	myMessageWrapper: {
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'center',
		margin: '5px 0',
	},
	otherMessageWrapper: {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		margin: '5px 0',
	},
	myMessageText: {
		color: '#fff',
		backgroundColor: '#7678ED',
		padding: '10px',
		borderRadius: 10,
	},
	otherMessageText: {
		color: '#fff',
		backgroundColor: '#F18701',
		padding: '10px',
		borderRadius: 10,
	},
	newMessageContainer: {
		alignItems: 'center',
		// position: 'absolute',
		bottom: 0,
		backgroundColor: 'rgba(238,238,238,.9)',
	},
	sendMessageButton: {
		paddingTop: '16px !important',
		paddingBottom: '16px !important',
		width: '100%',
	},
}));

const link = new WebSocketLink({
	uri: `ws://localhost:4000/`,
	options: {
		reconnect: true,
	},
});

const client = new ApolloClient({
	link,
	uri: 'http://localhost:4000/',
	cache: new InMemoryCache(),
});

const GET_MESSAGES_SUB = gql`
	subscription {
		messages {
			id
			content
			user
		}
	}
`;

const POST_MESSAGE = gql`
	mutation ($user: String!, $content: String!) {
		postMessage(user: $user, content: $content)
	}
`;

const Messages = (props, { user }) => {
	const classes = useStyles();
	const { data, loading } = useSubscription(GET_MESSAGES_SUB);

	return (
		<Container className={classes.messagesContainer}>
			<Grid container spacing={3} className={classes.messagesWrapper}>
				{!loading &&
					data.messages.map(({ id, user: messageUser, content }) => {
						if (props.username === messageUser) {
							return (
								<div key={id} className={(classes.message, classes.myMessageWrapper)}>
									<Grid item>
										<Typography className={classes.myMessageText}>{content}</Typography>
									</Grid>
								</div>
							);
						} else {
							return (
								<div key={id} className={(classes.message, classes.otherMessageWrapper)}>
									<Grid item className={classes.messageUserIcon} mr={1}>
										{messageUser.slice(0, 2).toUpperCase()}
									</Grid>
									<Grid item>
										<Typography className={classes.otherMessageText}>{content}</Typography>
									</Grid>
								</div>
							);
						}
					})}
			</Grid>
		</Container>
	);
};

const NewMessage = (props) => {
	const [newMessageText, setNewMessageText] = useState('');
	const [postMessage] = useMutation(POST_MESSAGE);
	const classes = useStyles();

	const sendMessage = () => {
		if (newMessageText.length > 0) {
			postMessage({ variables: { user: props.username, content: newMessageText } });
		}

		setNewMessageText('');
	};

	const handleNewMessageChange = (e) => {
		setNewMessageText(e.target.value);
	};

	return (
		<Container>
			<Grid container className={classes.newMessageContainer}>
				<Grid item xs={5} md={3} flexGrow={1}>
					<Box>
						<TextField label='Your Name' value={props.username} onChange={(e) => props.changeUsername(e)} />
					</Box>
				</Grid>
				<Grid item xs={9} md={7}>
					<Box>
						<TextField
							fullWidth
							label='New Message'
							value={newMessageText}
							onChange={(e) => handleNewMessageChange(e)}
							onKeyUp={(e) => {
								if (e.key === 'Enter') sendMessage();
							}}
						/>
					</Box>
				</Grid>
				<Grid item xs={3} md={2}>
					<Box sx={{ m: 2 }}>
						<Button variant='contained' className={classes.sendMessageButton} onClick={() => sendMessage()}>
							Send
						</Button>
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
};

const Chat = () => {
	const classes = useStyles();
	const [username, setUsername] = useState('');

	const handleUsernameChange = (e) => {
		setUsername(e.target.value);
	};

	return (
		<ApolloProvider client={client}>
			<div className={classes.mainContainer}>
				<Messages username={username} />
				<NewMessage username={username} changeUsername={handleUsernameChange} />
			</div>
		</ApolloProvider>
	);
};

export default Chat;
