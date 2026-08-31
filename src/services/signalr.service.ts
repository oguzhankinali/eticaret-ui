import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";

export class SignalRService {
    private _connection?: HubConnection;

    start(hubUrl: string): HubConnection {
        if (!this._connection || this._connection.state === HubConnectionState.Disconnected) {
            const builder: HubConnectionBuilder = new HubConnectionBuilder();
            const hubConnection: HubConnection = builder
                .withUrl(hubUrl)
                .withAutomaticReconnect()
                .build();

            hubConnection.start()
                .then(() => console.log("SignalR bağlantısı başarıyla kuruldu."))
                .catch((error) => {
                    console.error("SignalR bağlantı hatası: ", error);
                    setTimeout(() => this.start(hubUrl), 2000);
                })
        }

        return hubConnection;
    }

    on(hubConnection: HubConnection, procedureName: string, callback: (...message: any[]) => void) {
        hubConnection.on(procedureName, callback);
    }
}