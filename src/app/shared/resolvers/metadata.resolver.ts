import { Injectable } from '@angular/core';
import { MetadataService } from '../services/metadata.service';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { IMetaData } from '../models/metadata';

@Injectable({
	providedIn: 'root'
})
export class MetadataResolver implements Resolve<IMetaData> {
	constructor(private metaDataService: MetadataService) {
	}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<IMetaData> {
		return this.metaDataService.getMetadata();
	}
}
