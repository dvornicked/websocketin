import ws from 'ws'

const port = 3001
const wss = new ws.Server(
	{
		port,
	},
	() => console.log(`Server started: http://localhost:${port}`),
)

wss.on('connection', (ws) => {
	ws.on('message', (data) => {
		const message = JSON.parse(data.toString())
		switch (message.event) {
			case 'message':
				broadcastMessage(message)
				break
			case 'connection':
				broadcastMessage(message)
				break
		}
	})
})

interface IMessage {
	event: string
	id: number
	date: string
	username: string
	message: string
}

const broadcastMessage = (message: IMessage) => {
	wss.clients.forEach((client) => {
		client.send(JSON.stringify(message))
	})
}
