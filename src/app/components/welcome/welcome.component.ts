import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  name:string ; 
  constructor() { }

  ngOnInit(): void {
    this.name = JSON.parse(localStorage.getItem('user')).name ; 
  }

}
