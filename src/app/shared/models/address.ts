import { ICity } from './city';

export interface IAddress {
	firstName: string;
	lastName: string;
	addressLine1: string;
	addressLine2: string;
	cityId: number;
	city: ICity;
	postalCode: string;
}
