import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { MatDialogRef } from "@angular/material/dialog";

interface RuleSection {
  name: string;
  fullname: string;
  state: boolean;
  data: RuleItem[];
}

interface RuleItem {
  isImportant: boolean;
  text: string;
}

@Component({
  selector: 'app-rulebook',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
})
export class RulesModelComponent implements OnInit {
  public sections: RuleSection[] = [];

  constructor(public dialogRef: MatDialogRef<RulesModelComponent>, private http: HttpClient) {}

  ngOnInit(): void {
    this.getJSON().subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) {
          this.sections = data;
          if (this.sections.length > 0) {
            this.sections[0].state = false;
          }
        }
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
  }

  public getJSON(): Observable<any> {
    return this.http.get('./assets/json/rules.json');
  }

  dismiss() {
    this.dialogRef.close();
  }

  toggleCollapse(clickedSection: string) {
    this.sections.forEach((section) => {
      section.state = section.name === clickedSection ? !section.state : true;
    });
  }
}
