import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  count: number = 0;
  mapurl: string = '';
  params: string = '';
  lat: number;
  lng: number;
  mapskey: string = ''; //  Update Google Maps Static API key
  constructor(private http: HttpClient) {}
  ngOnInit() {
          navigator.geolocation.getCurrentPosition(position => {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            this.http.get('/api/threats?lat=' + this.lat + '&lng=' + this.lng).subscribe(data => {
              for(let point in data)
              {
                this.count++;
                this.params += '&markers=color:red%7Clabel:x%7C' + point['latitude']  + ',' + point['longitude'];
              }
              this.http.get('https://maps.googleapis.com/maps/api/staticmap?zoom=13&size=600x300&maptype=roadmap&key=' + this.mapskey + this.params).subscribe(data2 => {
                this.mapurl = data2['url'];
              });
            })
          });
    
 
}
  

}
