import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';

import { DosyaYukle } from '../models/dosyayukle';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { Uye } from '../models/uye';


@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceService {
  private basePath = '/yüklemeler';
  private dbUye = '/üyeler';
  uyeRef: AngularFireList<Uye> = null;
  kayitRef: AngularFireList<DosyaYukle> = null;

  constructor(private db: AngularFireDatabase, private storage: AngularFireStorage,
    public afAuth: AngularFireAuth) {
    this.uyeRef = db.list(this.dbUye);
    this.kayitRef = db.list(this.basePath);
  }

  giris(mail: string, parola: string) {
    return this.afAuth.signInWithEmailAndPassword(mail, parola);
  }

  cikis() {
    return this.afAuth.signOut();
  }

  kayit(uye: Uye) {
    return this.afAuth.createUserWithEmailAndPassword(uye.mail, uye.parola);
  }

  uyeEkle(uye: Uye) {
    return this.uyeRef.push(uye);
  }

  logInControl() {
    if (localStorage.getItem("user")) {
      return true;
    } else {
      return false;
    }
  }

  yukleStorage(dosyaYukle: DosyaYukle): Observable<number> {
    const filePath = `${this.basePath}/${dosyaYukle.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const yuklemeTask = this.storage.upload(filePath, dosyaYukle.file);

    yuklemeTask.percentageChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          dosyaYukle.url = downloadURL;
          dosyaYukle.name = dosyaYukle.file.name;
          this.kaydet(dosyaYukle);
        });
      })
    ).subscribe();

    return yuklemeTask.percentageChanges();
  }

  private kaydet(dosyaYukle: DosyaYukle) {
    this.db.list(this.basePath).push(dosyaYukle);
  }

  yukleme(n): AngularFireList<DosyaYukle> {
    return this.db.list(this.basePath, ref =>
      ref.limitToLast(n));
  }

  silme(dosyaYukle: DosyaYukle) {
    this.silDatabase(dosyaYukle.key)
      .then(() => {
        this.silStorage(dosyaYukle.name);
      })
      .catch(error => console.log(error));
  }

  private silDatabase(key: string) {
    return this.db.list(this.basePath).remove(key);
  }

  private silStorage(name: string) {
    const storageRef = this.storage.ref(this.basePath);
    storageRef.child(name).delete();
  }

  KayitEkle(kayit: DosyaYukle) {
    return this.kayitRef.push(kayit);
  }

  KayitListeleByUID(uid: string) {
    return this.db.list("/yüklemeler", q => q.orderByChild("uid").equalTo(uid));
  }

}
