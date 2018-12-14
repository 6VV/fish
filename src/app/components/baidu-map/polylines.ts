// 用于在百度地图上绘制折线

declare var BMap: any;
declare var BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW: any;

export class Polylines {
  private baiduPoints = []; // 线段点组集合
  private quals = []; // 线段质量集合
  private lines = []; // 已画的线

  constructor(private map) {}

  public updatePolyline(gpsValue): void {
    const point = this.getPoint(gpsValue);
    this.addPoint(point, gpsValue.qual);
    this.updateNewLine();
  }

  private addPoint(point, qual): void {
    if (this.baiduPoints.length === 0) {
      // 若为第一个点，记录该点
      this.baiduPoints.push([point]);
      this.quals.push(qual);
    } else {
      const len = this.baiduPoints.length;
      const lastPoints = this.baiduPoints[len - 1];

      if (this.map.getDistance(point, lastPoints[lastPoints.length - 1]) < 1) {
        // 若距离上一个点过近，则跳过该点
        return;
      }

      const lastQual = this.quals[len - 1];

      if (qual === lastQual) {
        // 若当前质量与上一点质量相同，则将该点添加到上一点所在数组中
        lastPoints.push(point);
      } else {
        // 若当前质量与上一点质量不同，则将该点添加到新数组中
        // 添加上一组的最后一个节点，以保证线段间的连续性
        this.baiduPoints.push([lastPoints[lastPoints.length - 1], point]);
        this.quals.push(qual);
      }
    }
  }

  private updateNewLine(): void {
    const lineNumber = this.baiduPoints.length;
    const lastPoints = this.baiduPoints[lineNumber - 1];

    if (lastPoints.length < 2) {
      // 若最后最新的数组长度小于2，不足以画线，返回
      return;
    }

    const lastQual = this.quals[lineNumber - 1];
    const polyline = this.getPolyline(lastPoints, this.getLineColor(lastQual));

    if (this.lines.length < lineNumber) {
      // 若未存在相应线段，则添加该线段
      this.map.addOverlay(polyline);
      this.lines.push(polyline);
    } else {
      // 若已存在相应线段，则删除后再添加改线段
      this.map.removeOverlay(this.lines[lineNumber - 1]);
      this.map.addOverlay(polyline);
      this.lines[lineNumber - 1] = polyline;
    }
  }

  private getPolyline(points, color = 'green') {
    // 因较短距离下连线中添加图标会导致错误，故暂不添加图标
    const sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
      scale: 0.6, // 图标缩放大小
      strokeColor: '#fff', // 设置矢量图标的线填充颜色
      strokeWeight: '1' // 设置线宽
    });
    const icons = new BMap.IconSequence(sy, '10', '30');
    return new BMap.Polyline(points, {
      enableEditing: false, // 是否启用线编辑，默认为false
      enableClicking: true, // 是否响应点击事件，默认为true
      // icons: [icons],
      strokeWeight: '4', // 折线的宽度，以像素为单位
      strokeOpacity: 0.8, // 折线的透明度，取值范围0 - 1
      strokeColor: color // 折线颜色
    });
  }

  private getLineColor(qual: number): string {
    // 根据质量获取线段颜色
    switch (qual) {
      case 4:
        return 'green';
      case 5:
        return 'blue';
      case 3:
        return 'BlueViolet';
      case 2:
        return 'yellow';
      default:
        return 'red';
    }
  }

  private getPoint(gpsValue) {
    return new BMap.Point(gpsValue.lon, gpsValue.lat);
  }
}
