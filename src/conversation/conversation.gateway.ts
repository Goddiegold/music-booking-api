import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  MessageBody,
  OnGatewayInit,
  OnGatewayDisconnect,
  ConnectedSocket,
  WebSocketServer,
} from "@nestjs/websockets";
import { ConversationService } from "./conversation.service";
import { Injectable } from "@nestjs/common";
import { Socket, Server } from "socket.io";
import { extractNameFromUsername } from "src/shared/helpers";

@WebSocketGateway({ cors: true })
@Injectable()
export class ConversationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly messageService: ConversationService) {}

  @WebSocketServer()
  private server: Server;
  private activeUsers = new Map<string, string>();

  afterInit(server: Server) {
    this.server = server;
    console.log("WebSocket Gateway Initialized");
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    // Generate a username from query or default to Guest-{client.id}
    const username =
      (client.handshake.query.username as string) ||
      `Guest-${client.id.slice(0, 5)}`;

    if (!client.handshake.query?.username) return;

    // Check if the username already exists in the map
    const existingUserId = this.getClientIdByUsername(username);

    if (existingUserId) {
      // If the username exists, delete the old client entry
      this.activeUsers.delete(existingUserId);
      console.log(
        `Removed existing user: ${existingUserId} for username: ${username}`,
      );
    }

    // Add the new client with the username
    this.activeUsers.set(client.id, username);
    console.log(`Client connected: ${client.id} as ${username}`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("sendMessage")
  async handleSendMessage(
    @MessageBody()
    data: {
      content: string;
      senderUsername: string;
      receiverUsername: string;
      conversationId: string;
    },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { content, senderUsername, receiverUsername } = data;
    // console.log("data", data)

    // Save the message in the database using the chat service
    const message = await this.messageService.createMessage({
      content,
      senderUsername,
      receiverUsername,
    });

    const receiverSocketId = Array.from(this.activeUsers.entries()).find(
      ([, username]) => username === receiverUsername,
    )?.[0];

    const convo = await this.messageService.getConvoBtnUsers({
      senderUsername,
      receiverUsername,
    });
    client.emit("messageSent", { message, convo });

    // Emit the message to all clients (you can adjust this for specific rooms if needed)
    if (receiverSocketId) {
      this.server
        .to(receiverSocketId)
        .emit("receiveMessage", { message, convo });
      const mobileMessage = `You have a new message from ${extractNameFromUsername(
        senderUsername,
      )}`;
      await this.messageService.sendMobileNotifcation(
        receiverUsername,
        mobileMessage,
        {
          type: "message-received",
          screen: "ChatBox",
          convoId: convo.id,
        },
      );
    }
  }




  private getClientIdByUsername(username: string): string | undefined {
    for (const [clientId, user] of this.activeUsers.entries()) {
      if (user === username) {
        return clientId;
      }
    }
    return undefined;
  }
}
