import { Component, OnInit } from '@angular/core';

import { FirebaseServiceService } from '../../services/firebase-service.service';
import { DosyaYukle } from '../../models/dosyayukle';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  secili: FileList;
  currentFileUpload: DosyaYukle;
  percentage: number;
  ad: string;

  constructor(private firebaseService: FirebaseServiceService,
    public firebaseservice: FirebaseServiceService,
    public router: Router) { }

  ngOnInit(): void {
    var user = JSON.parse(localStorage.getItem("user"));
    this.ad = user.displayName;
  }

  selectFile(event) {
    this.secili = event.target.files;
  }

  upload() {
    const file = this.secili.item(0);
    this.secili = undefined;

    this.currentFileUpload = new DosyaYukle(file);
    this.firebaseService.pushFileStorage(this.currentFileUpload).subscribe(
      percentage => {
        this.percentage = Math.round(percentage);
      },
      error => {
        console.log(error);
      }
    );
    var user = JSON.parse(localStorage.getItem("user"));
    this.currentFileUpload.uid = user.uid;
    
  }

  kapat() {
    this.firebaseService.cikis().then(d => {
      localStorage.removeItem("user");
      this.router.navigate(['/login']);
    });
  }

}