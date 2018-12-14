// GPS数据

export class GPSValue {
  private latDistance = 0.006996748266679731; // 百度数据与GPS数据差值
  private lonDistance = 0.012772638020337013;
  private _lat = 0;
  private _lon = 0;
  private _qual = 0;
  private _sats = 0;
  private _direction = 0;

  constructor() {}

  set lat(lat: number) {
    this._lat = lat + this.latDistance;
  }

  get lat(): number {
    return this._lat;
  }

  set lon(lon: number) {
    this._lon = lon + this.lonDistance;
  }

  get lon(): number {
    return this._lon;
  }

  set qual(qual: number) {
    this._qual = qual;
  }

  get qual(): number {
    return this._qual;
  }
  set sats(sats: number) {
    this._sats = sats;
  }

  get sats(): number {
    return this._sats;
  }

  set direction(direction: number) {
    this._direction = direction;
  }

  get direction(): number {
    return this._direction;
  }
}
