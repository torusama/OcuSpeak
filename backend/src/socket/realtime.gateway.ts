import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

/**
 * Single realtime channel shared by the Patient Web app and the Caregiver
 * mobile/web app. Both sides join a room named `child:<childId>` so events
 * created by one side (an AAC message, a caregiver reply, an SOS alert, a
 * monitoring/device-status update) are pushed to the other side instantly.
 */
@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/realtime',
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger('RealtimeGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  private childRoom(childId: string) {
    return `child:${childId}`;
  }

  @SubscribeMessage('join:child')
  handleJoinChild(
    @MessageBody() data: { childId: string; role: 'PATIENT' | 'CAREGIVER' },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(this.childRoom(data.childId));
    client.data.childId = data.childId;
    client.data.role = data.role;
    this.server.to(this.childRoom(data.childId)).emit('presence:update', {
      role: data.role,
      status: 'ONLINE',
    });
    return { joined: data.childId };
  }

  @SubscribeMessage('leave:child')
  handleLeaveChild(@MessageBody() data: { childId: string }, @ConnectedSocket() client: Socket) {
    client.leave(this.childRoom(data.childId));
  }

  // ---- Server-triggered broadcasts, called from feature services ----

  emitCommunicationEvent(childId: string, event: unknown) {
    this.server.to(this.childRoom(childId)).emit('communication:new', event);
  }

  emitCaregiverResponse(childId: string, response: unknown) {
    this.server.to(this.childRoom(childId)).emit('communication:response', response);
  }

  emitSosAlert(childId: string, alert: unknown) {
    this.server.to(this.childRoom(childId)).emit('sos:alert', alert);
  }

  emitSosUpdate(childId: string, alert: unknown) {
    this.server.to(this.childRoom(childId)).emit('sos:update', alert);
  }

  emitMonitoringUpdate(childId: string, record: unknown) {
    this.server.to(this.childRoom(childId)).emit('monitoring:update', record);
  }

  emitDeviceStatus(childId: string, device: unknown) {
    this.server.to(this.childRoom(childId)).emit('device:status', device);
  }
}
