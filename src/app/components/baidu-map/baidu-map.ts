import { Polylines } from './polylines';
import { GPSValue } from './gps-value';

// 百度地图

declare var BMap: any;

export class BaiduMap {
  private _map = null;
  private _carMarker = null;
  private _polylines: Polylines = null;
  private _gpsValue = new GPSValue();
  private _gpsValueSaved = new GPSValue();
  private _gpsInfo = '';
  private LINE_FILTER_LEVEL = 1;

  constructor() {
    this.initMap();
    this._polylines = new Polylines(this._map);
  }

  get gpsValue() {
    return this._gpsValue;
  }

  get gpsValueSaved() {
    return this._gpsValueSaved;
  }

  get gpsInfo() {
    return this._gpsInfo;
  }

  private initMap(): void {
    this._map = new BMap.Map('allmap'); // 创建Map实例
    const initPoint = new BMap.Point(116.33976405650638, 39.98480800644588);
    this._map.centerAndZoom(initPoint, 15);
    // this._map.addControl(new BMap.NavigationControl()); // 添加平移缩放控件
    this._map.addControl(new BMap.ScaleControl()); // 添加比例尺控件
    this._map.addControl(new BMap.OverviewMapControl()); // 添加缩略地图控件
    this._map.addControl(new BMap.MapTypeControl()); // 添加地图类型控件
    this._map.enableScrollWheelZoom(true);

    this._carMarker = this.createCarMarker(initPoint);
    this._map.addOverlay(this._carMarker);
  }

  public update(gpsValue) {
    if (gpsValue.qual < this.LINE_FILTER_LEVEL) {
      // 若为无效点，则返回
      return;
    }
    this._gpsValue = gpsValue;
    this.updateCarMarker(gpsValue);
    this.updateMessage(gpsValue, this._gpsValueSaved);
    this.updatePolyline(gpsValue);
  }

  public saveGpsValue(): void {
    this._gpsValueSaved = this._gpsValue;
  }

  private createCarMarker(point) {
    const carIcon = new BMap.Icon(
      'assets/images/fish.jpeg',
      new BMap.Size(30, 50),
      {
        // 小车图片
        // offset: new BMap.Size(0, -5),    //相当于CSS精灵
        imageOffset: new BMap.Size(0, 0) // 图片的偏移量。为了是图片底部中心对准坐标点。
      }
    );
    const marker = new BMap.Marker(point, {
      icon: carIcon
    });
    marker.addEventListener('click', function() {
      const opts = {
        width: 250, // 信息窗口宽度
        height: 300, // 信息窗口高度
        title: '位置信息' // 信息窗口标题
      };

      // 创建信息窗口对象
      const infoWindow = new BMap.InfoWindow(
        document.getElementById('info'),
        opts
      );
      infoWindow.addEventListener('clickclose', function() {
        document
          .getElementById('info-t')
          .appendChild(document.getElementById('info'));
        infoWindow.setContent('');
      });
      infoWindow.disableCloseOnClick();

      this.map.openInfoWindow(infoWindow, marker.getPosition());
    });
    return marker;
  }

  private updateCarMarker(gpsValue): void {
    const point = new BMap.Point(gpsValue.lon, gpsValue.lat);
    this._carMarker.setPosition(point);
    this._carMarker.setRotation(gpsValue.direction);
  }

  private getDistance(lat1, lon1, lat2, lon2) {
    const point1 = new BMap.Point(lon1, lat1);
    const point2 = new BMap.Point(lon2, lat2);
    return this._map.getDistance(point1, point2);
  }

  private updateMessage(gpsValue, gpsValueSaved): void {
    this._gpsInfo = this.getPositionInfo(gpsValue, gpsValueSaved);
    // const element = document.getElementById('gpsText');
    // if (element) {
    //   element.innerText = this.getPositionInfo(gpsValue, gpsValueSaved);
    // }
  }

  private updatePolyline(gpsValue) {
    this._polylines.updatePolyline(gpsValue);
  }

  private getPositionInfo(gpsValue, gpsValueSaved): string {
    const dis = this.getDistance(
      gpsValue.lat,
      gpsValue.lon,
      gpsValueSaved.lat,
      gpsValueSaved.lon
    );

    return (
      '纬度： ' +
      gpsValue.lat +
      '\n经度： ' +
      gpsValue.lon +
      '\n质量： ' +
      gpsValue.qual +
      '\n卫星： ' +
      gpsValue.sats +
      '\n距离： ' +
      dis +
      '\n方向： ' +
      gpsValue.direction
    );
  }
}
