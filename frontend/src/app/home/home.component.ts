import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QueryService } from '../query.service';
import { Router } from '@angular/router';


export class searchResult {
  _id?;
  uname: string;
  title: string;
  post: string;
  link: string;
  timestamp: string;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  searchText: string;
  results: Array<searchResult>;
  constructor(private queryService: QueryService, private router: Router) { }

  ngOnInit() {
  }
  searchTitle(){
    //Search for this string
    //alert("Search Title: "+this.searchText);
    this.queryService.query(this.searchText).subscribe((res: Response) => {
      this.results = res as unknown as Array<searchResult>;
      for (var _i = 0; _i < this.results.length; _i++) {

        this.results[_i].link = '/post?uname=' + this.results[_i].uname + '&id=' + this.results[_i]._id +
        '&title=' + this.results[_i].title + '&timeStamp=' + this.results[_i].timestamp + '&post=' + this.results[_i].post ;
    }
      console.log(this.results);
    });

    
  }

}
