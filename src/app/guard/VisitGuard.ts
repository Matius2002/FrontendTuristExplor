import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {VisitService} from "../Reportes/visit-service.service";


@Injectable({
  providedIn: 'root'
})
export class VisitGuard implements CanActivate {
  constructor(private visitService: VisitService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    this.visitService.registerVisit(state.url).subscribe(
      response => {
        console.log('Visita registrada:', response);
      },
      error => {
        console.error('Error al registrar la visita:', error);
      }
    );
    return true;
  }
}
