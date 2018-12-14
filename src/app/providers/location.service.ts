import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { TouchSequence } from 'selenium-webdriver';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
// import * as SerialPort from 'serialport';
import * as path from 'path';


@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private objList = new Array();

  private dataList: string[];
  private index = 0;

  constructor(private electronService: ElectronService) {
    this.mock();
  }

  // 模拟获取数据
  private mock() {

    // 读取数据
    this.electronService.fs.readFile(path.join(this.electronService.remote.app.getAppPath(),
      './file/gps_test.txt'), { flag: 'r' }, (err, data) => {
        if (err) {
          console.log(err);
          return;
        }

        // 分割每行数据
        this.dataList = data.toString().split('\n');

        // 定时发送数据
        setInterval(() => {
          const line = this.dataList[this.index++].trim();
          const values = line.split(',');
          if (values.length !== 4) {
            console.log('err');
            return;
          }

          // 将数据解析为json格式
          const jsonData = {};
          for (let i = 0; i < values.length; ++i) {
            const keyValue = values[i].split(':');
            jsonData[keyValue[0]] = Number(keyValue[1]);
          }

          // 触发数据处理事件
          this.objList.forEach(element => {
            element.onSub(jsonData);
          });
        }, 1000);
      });
  }

  /**
    * regist
    * 注册回调函数所在对象
    */
  public regist(obj: any) {
    this.objList.push(obj);
  }


}
