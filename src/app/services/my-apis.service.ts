import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Country } from '../model/country';
import { Ip } from '../model/ip';
import { map, mapTo, mergeMap } from 'rxjs/operators';
/* use those apis to get user geolocations and nationality all apis accept get request
https://backofficeapi.online-tkt.com/api/GetAllCountriesByLangName?LangCode=en
returns all countries with country codes
*********
https://api.ipify.org/?format=json
returns users ip adress
*********
use ip adress to get user geo location and country
https://ipapi.co/${ip-adress}/json/
*/

@Injectable({
  providedIn: 'root'
})
export class MyApisService {

  constructor(private http: HttpClient) { }

  getCountries() {
    return this.http.get<Country[]>("https://backofficeapi.online-tkt.com/api/GetAllCountriesByLangName?LangCode=en");
  }

  //Getting user's IP-address from first api, then using that IP in another api to get user's country data
  getCountryKeyCode() {
    return this.http.get<Ip>("https://api.ipify.org/?format=json")
      .pipe(mergeMap((data) => this.http.get<any>(`https://ipapi.co/${data.ip}/json/`)));
  }


}
