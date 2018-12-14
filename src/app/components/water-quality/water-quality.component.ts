import { Component, OnInit } from '@angular/core';
import { LocationService } from '../../providers/location.service';
import { text } from '@angular/core/src/render3';

@Component({
  selector: 'app-water-quality',
  templateUrl: './water-quality.component.html',
  styleUrls: ['./water-quality.component.scss']
})
export class WaterQualityComponent implements OnInit {

  public text = '';

  constructor(private locationService: LocationService) {
  }

  ngOnInit() {
    this.locationService.regist(this);
  }

  public onSub(data) {
    this.text += JSON.stringify(data);
    console.log(data);
  }

}
