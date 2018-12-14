// GPS数据

export class GPSValue {
  // private latDistance = 0.006996748266679731; // 百度数据与GPS数据差值
  // private lonDistance = 0.012772638020337013;
  static latDistance = 0;
  static lonDistance = 0;
  public lat = 0;
  public lon = 0;
  public qual = 4;
  private _sats = 0;
  public direction = 0;

  constructor() { }

  public convert() {
    const value = new GPSValue();
    value.lat = this.lat + GPSValue.latDistance;
    value.lon = this.lon + GPSValue.lonDistance;
    value.qual = this.qual;
    value.sats = this.sats;
    value.direction = this.direction;

    return value;
  }

  set sats(s: number) {
    this._sats = s;
    if (s > 12) {
      this.qual = 4;
    } else if (s > 10) {
      this.qual = 5;
    } else if (s > 8) {
      this.qual = 3;
    } else if (s > 6) {
      this.qual = 2;
    } else {
      this.qual = 0;
    }
  }

  get sats(): number {
    return this._sats;
  }

}
