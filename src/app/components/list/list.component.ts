import { Component, OnInit } from '@angular/core';

import { map } from 'rxjs/operators';
import { DosyaYukle } from 'src/app/models/dosyayukle';
import { FirebaseServiceService } from '../../services/firebase-service.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  yuklenenler: DosyaYukle[];

  adsoyad: string;
  uid: string;

  constructor(private firebaseService: FirebaseServiceService) { }

  ngOnInit(): void {
    this.firebaseService.yukleme(6).snapshotChanges().pipe(
      map(degisiklikler =>
        degisiklikler.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
    ).subscribe(yuklenenler => {
      this.yuklenenler = yuklenenler;
    });
    var user = JSON.parse(localStorage.getItem("user"));
    this.uid = user.uid;
    this.adsoyad = user.displayName;
    this.KayitListele();
  }

  KayitListele() {
    this.firebaseService.KayitListeleByUID(this.uid).snapshotChanges().subscribe(data => {
      this.yuklenenler = [];
      data.forEach(satir => {
        const y = { ...satir.payload.toJSON(), key: satir.key };
        this.yuklenenler.push(y as DosyaYukle);
      });
    });
  }

}
