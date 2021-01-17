import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Sonuc } from '../../models/sonuc';
import { FirebaseServiceService } from '../../services/firebase-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  sonuc: Sonuc = new Sonuc();

  constructor(public firebaseService: FirebaseServiceService, public router: Router) { }

  ngOnInit(): void {
  }

  /*girisYap(mail:string, parola: string) {
    this.firebaseService.logIn(mail, parola).then(d => {
      localStorage.setItem("user", JSON.stringify(d.user));
      this.router.navigate(['/']);
    }, err => {
      this.sonuc.islem = false;
      this.sonuc.mesaj = "Mail Adresi veya Parola Geçersiz!";
    });
  }*/

  girisYap(mail:string, parola: string) {
    this.firebaseService.giris(mail, parola).then(d => {
      localStorage.setItem("user", JSON.stringify(d.user));
      this.router.navigate(['/']);
    }).catch(error => {
      this.sonuc.islem = false;
      this.sonuc.mesaj = error.message;
    });
  }

}