import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-assess',
  templateUrl: './assess.component.html',
  styleUrls: ['./assess.component.css']
})
export class AssessComponent implements OnInit {
safetyScore:number = 0;
criminalScore:number = 0;
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }
  getScore(id) {
    this.http.get('/api/events/'+id).subscribe(data => {
      let sum = 0;
      let count = 0;
      for(let review in data['reviews'])
      {
        count++;
        sum+=review['rating'];
      }
     this.safetyScore = sum/count;
      for(let visitor in data['visitors']) {
        this.http.get('/api/crimeRecords/' + visitor).subscribe(data2 => {
          if(data2['criminal'] == true)
          {
            this.criminalScore++;
          }
        });
      }   
    });
    return {
      'criminals': this.criminalScore,
      'rating': this.safetyScore
    };
  }
}
