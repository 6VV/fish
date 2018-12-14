import { Polylines } from './polylines';
import { GPSValue } from './gps-value';

// 百度地图

declare var BMap: any;

export class BaiduMap {
  private map = null;
  private carMarker = null;
  private polylines: Polylines = null;
  private gpsValue = new GPSValue();
  private gpsValueSaved = new GPSValue();
  // private gpsInfo = '';
  private LINE_FILTER_LEVEL = 1;
  private SAT_FILTER_NUMBER = 5;
  private convertor = new BMap.Convertor();

  constructor() {
    this.initMap();
    this.polylines = new Polylines(this.map);
  }

  // get gpsValue() {
  //   return this._gpsValue;
  // }

  // get gpsValueSaved() {
  //   return this._gpsValueSaved;
  // }

  // get gpsInfo() {
  //   return this._gpsInfo;
  // }

  private initMap(): void {
    this.map = new BMap.Map('allmap'); // 创建Map实例
    const initPoint = new BMap.Point(112.3614787892737, 34.660034293551064);
    this.map.centerAndZoom(initPoint, 15);
    // this._map.addControl(new BMap.NavigationControl()); // 添加平移缩放控件
    this.map.addControl(new BMap.ScaleControl()); // 添加比例尺控件
    this.map.addControl(new BMap.OverviewMapControl()); // 添加缩略地图控件
    this.map.addControl(new BMap.MapTypeControl()); // 添加地图类型控件
    this.map.enableScrollWheelZoom(true);

    this.carMarker = this.createCarMarker(initPoint);
    this.map.addOverlay(this.carMarker);
  }

  public update(gpsValue: GPSValue) {
    if (gpsValue.sats < this.SAT_FILTER_NUMBER) {
      // 若为无效点，则返回
      return;
    }

    // 判断当前点与记录点的位置差，若过大则重新记录百度坐标偏移
    if (Math.abs(gpsValue.lon - this.gpsValueSaved.lon) > 0.1
      || Math.abs(gpsValue.lat - this.gpsValueSaved.lat) > 0.1) {
      const point = new BMap.Point(gpsValue.lon, gpsValue.lat); // 转换为百度格式

      // 转换为百度地理位置
      this.convert(point, (data) => {
        if (data.status === 0) {
          const baiduPoint = data.points[0];

          // 记录当前百度坐标偏移
          GPSValue.latDistance = baiduPoint.lat - gpsValue.lat;
          GPSValue.lonDistance = baiduPoint.lng - gpsValue.lon;

          // 转换
          this.gpsValue = gpsValue.convert();

          // 更新显示
          this.updateCarMarker(this.gpsValue);
          this.updatePolyline(this.gpsValue);

          // 位置居中
          this.map.setCenter(baiduPoint);

          // 保存本次转换位置
          this.gpsValueSaved = gpsValue;

        }
      });
    } else {
      this.gpsValue = gpsValue.convert();
      this.updateCarMarker(this.gpsValue);
      this.updatePolyline(this.gpsValue);

    }
  }

  public saveGpsValue(): void {
    this.gpsValueSaved = this.gpsValue;
  }

  private convert(googlePoint, callback: (data) => void) {
    const pointArr = [];
    pointArr.push(googlePoint);
    this.convertor.translate(pointArr, 1, 5, callback);
  }

  private createCarMarker(point) {
    const carIcon = new BMap.Icon(
      'assets/images/fish.png',
      new BMap.Size(38, 60),
      {
        // 小车图片
        // offset: new BMap.Size(0, -5),    //相当于CSS精灵
        imageOffset: new BMap.Size(0, 0) // 图片的偏移量。为了是图片底部中心对准坐标点。
      }
    );
    const marker = new BMap.Marker(point, {
      icon: carIcon
    });
    marker.addEventListener('click', function () {
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
      infoWindow.addEventListener('clickclose', function () {
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
    this.carMarker.setPosition(point);
    this.carMarker.setRotation(gpsValue.direction);
  }

  // private getDistance(lat1, lon1, lat2, lon2) {
  //   const point1 = new BMap.Point(lon1, lat1);
  //   const point2 = new BMap.Point(lon2, lat2);
  //   return this.map.getDistance(point1, point2);
  // }

  // private updateMessage(gpsValue, gpsValueSaved): void {
  //   this._gpsInfo = this.getPositionInfo(gpsValue, gpsValueSaved);
  // }

  private updatePolyline(gpsValue) {
    this.polylines.updatePolyline(gpsValue);
  }

  // private getPositionInfo(gpsValue, gpsValueSaved): string {
  //   const dis = this.getDistance(
  //     gpsValue.lat,
  //     gpsValue.lon,
  //     gpsValueSaved.lat,
  //     gpsValueSaved.lon
  //   );

  //   return (
  //     '纬度： ' +
  //     gpsValue.lat +
  //     '\n经度： ' +
  //     gpsValue.lon +
  //     '\n质量： ' +
  //     gpsValue.qual +
  //     '\n卫星： ' +
  //     gpsValue.sats +
  //     '\n距离： ' +
  //     dis +
  //     '\n方向： ' +
  //     gpsValue.direction
  //   );
  // }
}
