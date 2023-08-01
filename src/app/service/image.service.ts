import { Injectable } from '@angular/core';
import { defer, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { addJBeforeWebp } from '../../assets/cardlists/DigimonCards';

@Injectable()
export class ImageService {
  // Function that checks the imagePath and emits it on the subject
  public checkImagePath(imagePath: string): Observable<string> {
    return this.checkImagePathExists(imagePath).pipe(
      catchError((error) => {
        return of('../../../assets/images/digimon-card-back.webp');
      }),
      switchMap((doesImagePathExist) => {
        if (doesImagePathExist === '../../../assets/images/digimon-card-back.webp') {
          const newPath = addJBeforeWebp(imagePath);
          return defer(() => this.checkImagePathExists(newPath));
        } else {
          return of(imagePath);
        }
      })
    );
  }

  // Function to check if an image path exists
  private checkImagePathExists(imagePath: string): Observable<string> {
    return new Observable<string>((observer) => {
      const img = new Image();
      img.onload = () => {
        observer.next(imagePath);
        observer.complete();
      };
      img.onerror = () => {
        observer.next('../../../assets/images/digimon-card-back.webp');
        observer.complete();
      };
      img.src = imagePath;
    });
  }
}
