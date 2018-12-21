import { Component, OnInit, OnDestroy } from '@angular/core';
import { GPSValue } from './gps-value';
import { BaiduMap } from './baidu-map';
import { LocationService } from '../../providers/location.service';

@Component({
  selector: 'app-baidu-map',
  templateUrl: './baidu-map.component.html',
  styleUrls: ['./baidu-map.component.css']
})
export class BaiduMapComponent implements OnInit, OnDestroy {
  public baiduMap: BaiduMap = null;

  constructor(private locationService: LocationService) {
  }

  ngOnInit() {
    this.baiduMap = new BaiduMap();
    this.locationService.regist(this.onSub);
    // this.locationService.regist(this.onSub);
  }

  ngOnDestroy(): void {
    this.locationService.unregist(this.onSub);
  }

  private onSub = (data): void => {
    const value = this.parseGpsValue(data);
    console.log(value);
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

  public clearDrawLine() {
    this.baiduMap.clearDrawLine();
  }
}
