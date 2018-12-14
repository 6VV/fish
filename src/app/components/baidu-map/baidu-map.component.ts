import { Component, OnInit } from '@angular/core';
import { GPSValue } from './gps-value';
import { BaiduMap } from './baidu-map';

@Component({
  selector: 'app-baidu-map',
  templateUrl: './baidu-map.component.html',
  styleUrls: ['./baidu-map.component.css']
})
export class BaiduMapComponent implements OnInit {
  public baiduMap: BaiduMap = null;

  constructor() { }

  ngOnInit() {
    this.baiduMap = new BaiduMap();
  }

  private messageCallback(data, obj): void {
    const jsonData = JSON.parse(data);
    const gpsValue = new GPSValue();
    gpsValue.lat = jsonData['lat_raw'];
    gpsValue.lon = jsonData['lon_raw'];
    gpsValue.qual = jsonData['qual'];
    gpsValue.sats = jsonData['sats'];
    gpsValue.direction = jsonData['heading'];

    obj.baiduMap.update(gpsValue);
  }

  private parseGpsValue(data): GPSValue {
    const gpsValue = new GPSValue();
    gpsValue.lat = data['lat_raw'];
    gpsValue.lon = data['lon_raw'];
    gpsValue.qual = data['qual'];
    gpsValue.sats = data['sats'];
    gpsValue.direction = data['heading'];

    return gpsValue;
  }

  private savePoint() {
    this.baiduMap.saveGpsValue();
  }
}
