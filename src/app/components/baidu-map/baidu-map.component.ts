import { Component, OnInit } from '@angular/core';
import { GPSValue } from './gps-value';
import { BaiduMap } from './baidu-map';
import { LocationService } from '../../providers/location.service';

@Component({
  selector: 'app-baidu-map',
  templateUrl: './baidu-map.component.html',
  styleUrls: ['./baidu-map.component.css']
})
export class BaiduMapComponent implements OnInit {
  public baiduMap: BaiduMap = null;

  constructor(private locationService: LocationService) {
  }

  ngOnInit() {
    this.baiduMap = new BaiduMap();
    this.locationService.regist(this);
  }

  private onSub(data): void {
    const value = this.parseGpsValue(data);
    this.baiduMap.update(value);
  }

  private parseGpsValue(data): GPSValue {
    const gpsValue = new GPSValue();
    gpsValue.lat = data['Lat'];
    gpsValue.lon = data['Lon'];
    // gpsValue.qual = jsonData['qual'];
    gpsValue.sats = data['Signal'];
    gpsValue.direction = data['Yaw'];

    return gpsValue;
  }

  public savePoint() {
    this.baiduMap.saveGpsValue();
  }
}
