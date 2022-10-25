import * as signalR from '@microsoft/signalr';
const hubURL = process.env.HUB_URL;

export let hubConnection;

export const startConnection = async () => {
  try {
    hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(`${hubURL}`, { skipNegotiation: true, transport: signalR.HttpTransportType.WebSockets})
      .withHubProtocol(new signalR.JsonHubProtocol())
      .withAutomaticReconnect()
      .build();

    await hubConnection.start();
    console.log('SignalR Connected');
  } catch (ex) {
    console.error(ex);
  }
};
