import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useSubscription, gql, useMutation } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { Container, Grid, Typography, Box, TextField, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
	messagesWrapper: {
		flexDirection: 'column !important',
		paddingTop: 50,
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
		marginTop: 50,
		alignItems: 'center',
	},
});

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
		<>
			<Container>
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
		</>
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
				<Grid item xs={3}>
					<Box>
						<TextField label='Your Name' value={props.username} onChange={(e) => props.changeUsername(e)} />
					</Box>
				</Grid>
				<Grid item xs={8}>
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
				<Grid item xs={1}>
					<Box sx={{ m: 2 }}>
						<Button variant='contained' onClick={() => sendMessage()}>
							Send
						</Button>
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
};

const Chat = () => {
	const [username, setUsername] = useState('');

	const handleUsernameChange = (e) => {
		setUsername(e.target.value);
	};

	return (
		<ApolloProvider client={client}>
			<div>
				<Messages username={username} />
			</div>
			<div>
				<NewMessage username={username} changeUsername={handleUsernameChange} />
			</div>
		</ApolloProvider>
	);
};

export default Chat;
