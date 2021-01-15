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
  private dbYol = '/yüklemeler';
  private dbUye = '/üyeler';
  uyeRef: AngularFireList<Uye> = null;
  kayitRef: AngularFireList<DosyaYukle> = null;

  constructor(private db: AngularFireDatabase, private storage: AngularFireStorage,
    public afAuth: AngularFireAuth) {
    this.uyeRef = db.list(this.dbUye);
    this.kayitRef = db.list(this.dbYol);
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

  pushFileStorage(fileUpload: DosyaYukle): Observable<number> {
    const filePath = `${this.dbYol}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask.percentageChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          fileUpload.url = downloadURL;
          fileUpload.name = fileUpload.file.name;
          this.kaydet(fileUpload);
        });
      })
    ).subscribe();

    return uploadTask.percentageChanges();
  }

  private kaydet(fileUpload: DosyaYukle) {
    this.db.list(this.dbYol).push(fileUpload);
  }

  yukleme(numara): AngularFireList<DosyaYukle> {
    return this.db.list(this.dbYol, ref =>
      ref.limitToLast(numara));
  }

  silme(fileUpload: DosyaYukle) {
    this.deleteFileDatabase(fileUpload.key)
      .then(() => {
        this.deleteFileStorage(fileUpload.name);
      })
      .catch(error => console.log(error));
  }

  private deleteFileDatabase(key: string) {
    return this.db.list(this.dbYol).remove(key);
  }

  private deleteFileStorage(name: string) {
    const storageRef = this.storage.ref(this.dbYol);
    storageRef.child(name).delete();
  }

  KayitEkle(kayit: DosyaYukle) {
    return this.kayitRef.push(kayit);
  }

  KayitListeleByUID(uid: string) {
    return this.db.list("/yüklemeler", q => q.orderByChild("uid").equalTo(uid));
  }

}
