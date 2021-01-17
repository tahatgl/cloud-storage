import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Sonuc } from 'src/app/models/sonuc';
import { Uye } from 'src/app/models/uye';
import { FirebaseServiceService } from 'src/app/services/firebase-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  sonuc: Sonuc = new Sonuc();
  secUye: Uye = new Uye();

  constructor(private firebaseService: FirebaseServiceService, public router: Router) { }

  ngOnInit(): void {
  }

  kayitYap() {
    this.firebaseService.kayit(this.secUye).then(d => {
      d.user.updateProfile({
        displayName: this.secUye.adsoyad
      });
      this.secUye.uid = d.user.uid;
      localStorage.setItem("user", JSON.stringify(d.user));
      this.uyeEkle();
    }).catch(error => {
      this.sonuc.islem = false;
      this.sonuc.mesaj = error.message;   
    });
  }

  uyeEkle() {
    this.firebaseService.uyeEkle(this.secUye).then(d => {
      this.router.navigate(['/']);
    }).catch(error => {
      this.sonuc.islem = false;
      this.sonuc.mesaj = error.message;   
    });
  }

}
