import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import * as path from 'path';
import { SerialportService } from './serialport.service';
import { EventEmitter } from 'events';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private objList = new Array();
  private dataEmitter = new EventEmitter();
  private type = 'location';

  private dataList: string[];
  private index = 0;
  private dataBuffer = '';

  constructor(private electronService: ElectronService, private serialPortService: SerialportService) {
    // this.mock();
    this.serialPortService.dataEmitter.subscribe((data) => {
      this.dataBuffer += data;
      const line = this.getLine(this.dataBuffer);
      if (line) {
        this.dataEmitter.emit(this.type, this.parse(line));
      }
    });
  }

  private getLine(text: string): string {
    const dataList = text.split('\n');
    const length = dataList.length;
    let result = '';

    // 当获取完整数据时，最后一组为空字符，故仅判断数组长度大于1时的情况
    if (length > 1 && dataList[length - 2].startsWith('Yaw')) {
      result = dataList[length - 2];
    }

    // 截取dataBuffer为最后一部分
    if (length > 0) {
      this.dataBuffer = dataList[length - 1];
    }

    return result;
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
          const line = this.dataList[this.index++];
          this.dataEmitter.emit(this.type, this.parse(line));
          // // 触发数据处理事件
          // this.objList.forEach(element => {
          //   element.onSub(jsonData);
          // });
        }, 1000);
      });
  }

  private parse(data: string): any {
    const values = data.trim().split(',');
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

    return jsonData;
  }

  public regist(fun: (data) => void) {
    this.dataEmitter.addListener(this.type, fun);
  }

  public unregist(fun: (data) => void) {
    this.dataEmitter.removeListener(this.type, fun);
  }

  public writeData(data): void {
    this.serialPortService.writeData(data);
  }

}
