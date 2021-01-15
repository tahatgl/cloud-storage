import { Component, OnInit } from '@angular/core';
import { FirebaseServiceService } from './services/firebase-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public firebaseService: FirebaseServiceService) { }
}
