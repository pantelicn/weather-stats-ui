import { Component, Output, EventEmitter } from '@angular/core';
import { WeatherService } from "../../services/weather.service";
import { City } from "../../types/city";
import { Temperature } from "../../types/temperature";
import { CitySearchQuery } from "../../types/city-search-query";
import { animate, style, transition, trigger } from "@angular/animations";

@Component({
  selector: 'app-weather-view',
  templateUrl: './weather-view.component.html',
  styleUrls: ['./weather-view.component.scss'],
  animations: [
    trigger(
      'appearAnimation',
      [
        transition(
          ':enter',
          [
            style({ height: 0, opacity: 0 }),
            animate('1s ease-out',
              style({ height: 280, opacity: 1 }))
          ]
        )
      ]
    )
  ]
})
export class WeatherViewComponent {

  city!: City;

  @Output() cityChanged = new EventEmitter<City>()

  constructor(private service: WeatherService) { }

  get startDate(): Date  {
    return this.city?.dayReports[0].date;
  }

  get endDate(): Date {
    return this.city?.dayReports[this.city.dayReports.length - 1].date;
  }

  get average(): Temperature {
    return this.city?.average;
  }

  get iconCode(): string | undefined {
    return this.city?.dayReports[0].hourReports[0].weatherIcon
  }

  onSearch(searchQuery: CitySearchQuery): void {
    this.service.get(searchQuery).subscribe(city => {
      this.city = city;
      this.cityChanged.emit(city);
      this.sortByDate();
    },() => {});
  }

  sortByDate(): void {
    let date1: Date;
    let date2: Date;
    this.city.dayReports = this.city.dayReports.sort((r1, r2) => {
      date1 = new Date(r1.date);
      date2 = new Date(r2.date);
      if (date1 < date2) {
        return -1;
      }
      if (date1 > date2) {
        return 1;
      }
      return 0;
    })
  }

}
