import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ToastService } from './toast-service.service';
import { User } from '../../types/user';
import {HubConnection, HubConnectionBuilder, HubConnectionState} from '@microsoft/signalr';
@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  private hubUrl=environment.hubUrl;
  private toast=inject(ToastService);
  // hubconnection method
  hubConnection?:HubConnection

  createHubConnection(user:User){
    // build the hub connection
   this.hubConnection=new HubConnectionBuilder()
   .withUrl(this.hubUrl+'presence',{
    accessTokenFactory:()=>user.token
   })
   .withAutomaticReconnect()
   .build();

   //start connection with fallback message if exists
   this.hubConnection.start()
   .catch(error=>console.log(error));

   this.hubConnection.on('UserOnline',email=>{
    this.toast.success(email+' has connected');
   });
   
   this.hubConnection.on('UserOffline',email=>{
    this.toast.info(email+' has disconnected');
   });
  }

  stopHubConnection(){
    if(this.hubConnection?.state==HubConnectionState.Connected){
      this.hubConnection.stop().catch(error=>{console.log(error) });
    }
  }

}
