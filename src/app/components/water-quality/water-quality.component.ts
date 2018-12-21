import { Component, OnInit } from '@angular/core';
import { SerialportService } from '../../providers/serialport.service';
import { LocationManager } from './locationManager';

@Component({
  selector: 'app-water-quality',
  templateUrl: './water-quality.component.html',
  styleUrls: ['./water-quality.component.scss']
})
export class WaterQualityComponent implements OnInit {

  public text = '';
  private locationManager = new LocationManager();

  constructor(private serialportService: SerialportService) {
  }

  ngOnInit() {
    this.serialportService.dataEmitter.subscribe((data) => {
      this.onSub(data);
    });
  }

  public onSub(data) {
    this.locationManager.append(data);
    this.text = this.locationManager.getText();
  }

}
