export class DosyaYukle {
    key: string;
    name: string;
    url: string;
    file: File;
    uid: string;
    kayTarih: string;

    constructor(file: File) {
        this.file = file;
    }
}