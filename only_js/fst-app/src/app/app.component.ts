import {Component} from '@angular/core';

@Component({
    selector: 'my-app',
    template: `<label>Text:</label>
    <input [(ngModel)]="name" placeholder="name">
    <h1>Your input: {{name}}</h1>`
})
export class AppComponent {
    name = '';
}
