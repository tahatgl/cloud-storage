import { Component, OnInit } from '@angular/core';

import { FirebaseServiceService } from '../../services/firebase-service.service';
import { DosyaYukle } from '../../models/dosyayukle';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  secili: FileList;
  yukluDosya: DosyaYukle;
  percentage: number;
  ad: string;

  constructor(private firebaseService: FirebaseServiceService,
    public firebaseservice: FirebaseServiceService,
    public router: Router,
    public toastr: ToastrService) { }


  ngOnInit(): void {
    var user = JSON.parse(localStorage.getItem("user"));
    this.ad = user.displayName;
  }

  dosyaSec(event) {
    this.secili = event.target.files;
  }

  yukle() {
    const file = this.secili.item(0);
    this.secili = undefined;

    this.yukluDosya = new DosyaYukle(file);
    this.firebaseService.yukleStorage(this.yukluDosya).subscribe(
      percentage => {
        this.percentage = Math.round(percentage);
        if (percentage == 100) {
          this.toastr.success("Dosyanız Yüklendi.","", {positionClass: 'toast-top-left'});
        }
      },
      error => {
        console.log(error);
        this.toastr.error("Lütfen tekrar deneyin.","Hata Oluştu!", {positionClass: 'toast-top-left'});

      }
    );
    var user = JSON.parse(localStorage.getItem("user"));
    this.yukluDosya.uid = user.uid;
    var tarih = new Date();
    this.yukluDosya.kayTarih = tarih.getTime().toString();
    
  }

  kapat() {
    this.firebaseService.cikis().then(d => {
      localStorage.removeItem("user");
      this.router.navigate(['/login']);
      this.toastr.info("Oturumunuz Kapatıldı.");
    });
  }

}
