import { Component, OnInit, Input } from '@angular/core';

import { DosyaYukle } from '../../models/dosyayukle';
import { FirebaseServiceService } from '../../services/firebase-service.service';
import { ListComponent } from '../list/list.component';

@Component({
  selector: 'app-detay',
  templateUrl: './detay.component.html',
  styleUrls: ['./detay.component.css']
})
export class DetayComponent implements OnInit {
  @Input() fileUpload: DosyaYukle;

  constructor(private firebaseService: FirebaseServiceService) { }

  ngOnInit(): void {
  }
  
  silme(fileUpload) {
    this.firebaseService.silme(fileUpload);
  }
}
