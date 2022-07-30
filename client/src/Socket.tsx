import { Box, Button, Flex, Input, Text, VStack } from '@chakra-ui/react'
import { useState, KeyboardEvent, useRef } from 'react'

interface IMessage {
	id: number
	event: 'message' | 'connection'
	username: string
	message?: string
}

export const Socket = () => {
	const [messages, setMessages] = useState<IMessage[]>([])
	const [value, setValue] = useState<string>('')
	const socket = useRef<WebSocket>()
	const [connected, setConnected] = useState(false)
	const [username, setUsername] = useState('')

	if (!connected)
		return (
			<>
				<Text align="center" fontSize="xl" mb="4">
					WebSocket
				</Text>
				<Flex>
					<Input
						value={username}
						onChange={(e: KeyboardEvent<HTMLInputElement>) => {
							setUsername(e.target.value)
						}}
						placeholder="Enter your name"
						type="text"
					/>
					<Button
						onClick={() => {
							socket.current = new WebSocket('ws://localhost:3001')
							socket.current.onopen = () => {
								setConnected(true)
								console.log('Connected')
								const message = {
									event: 'connection',
									username,
									id: Date.now(),
								}
								socket.current?.send(JSON.stringify(message))
							}
							socket.current.onmessage = ({ data }) => {
								const message = JSON.parse(data)
								setMessages((prev) => [message, ...prev])
							}
							socket.current.onclose = () => {
								console.log('Socket closed')
							}
							socket.current.onerror = () => {
								console.log('Socket error')
							}
						}}
					>
						Enter
					</Button>
				</Flex>
			</>
		)

	return (
		<>
			<Text align="center" fontSize="xl" mb="4">
				WebSocket
			</Text>
			<Flex>
				<Input
					value={value}
					onChange={(e: KeyboardEvent<HTMLInputElement>) => {
						setValue(e.target.value)
					}}
					type="text"
				/>
				<Button
					onClick={async () => {
						const message: IMessage = {
							id: Date.now(),
							username,
							message: value,
							event: 'message',
						}
						socket.current?.send(JSON.stringify(message))
						setValue('')
					}}
				>
					Send
				</Button>
			</Flex>
			<VStack>
				{messages.map((item) => (
					<Box key={item.id}>
						{item.event === 'connection'
							? `User ${item.username} connected`
							: item.message}
					</Box>
				))}
			</VStack>
		</>
	)
}
