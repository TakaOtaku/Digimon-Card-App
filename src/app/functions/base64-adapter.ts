export class Base64Adapter {
  reader: any;
  loader: any;

  constructor(loader: any) {
    this.loader = loader;
  }

  upload() {
    return new Promise((resolve: any, reject: any) => {
      const reader = (this.reader = new window.FileReader());

      reader.addEventListener('load', () => {
        resolve({ default: reader.result });
      });

      reader.addEventListener('error', (err) => {
        reject(err);
      });

      reader.addEventListener('abort', () => {
        reject();
      });

      this.loader.file.then((file: any) => {
        reader.readAsDataURL(file);
      });
    });
  }

  abort() {
    this.reader.abort();
  }
}
