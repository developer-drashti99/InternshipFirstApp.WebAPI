import { Component, input, OnInit } from '@angular/core';
import { Member } from '../../../types/member';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],
  imports: [RouterLink]
})
export class MemberCardComponent implements OnInit {
  member=input.required<Member>();
  constructor() { }

  ngOnInit() {
  }

}
