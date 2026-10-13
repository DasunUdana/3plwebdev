import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
	intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(httpRequest.clone({ setHeaders: { 'Content-Type' : 'application/json; charset=utf-8' } }));
	}
}
