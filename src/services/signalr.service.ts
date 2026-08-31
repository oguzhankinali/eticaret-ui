import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

export class SignalRService {


    start(hubUrl: string): HubConnection {
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
        return hubConnection;
    }

    on(hubConnection: HubConnection, procedureName: string, callback: (...message: any[]) => void) {
        hubConnection.on(procedureName, callback);
    }
}