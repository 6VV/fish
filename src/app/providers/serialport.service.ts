import { Injectable, Output, EventEmitter } from '@angular/core';
import { ElectronService } from './electron.service';
import * as SerialPort from 'serialport';


@Injectable({
  providedIn: 'root'
})
export class SerialportService {
  private serialportClass: typeof SerialPort;
  private serialport: SerialPort = null;

  @Output()
  public dataEmitter = new EventEmitter<string>();

  constructor(private electronService: ElectronService) {
    this.serialportClass = this.electronService.remote.require('serialport');
  }

  public getSerialPortClass(): typeof SerialPort {
    return this.serialportClass;
  }

  public createPort(com: string, baudrate: number): void {
    this.closePort();

    this.serialport = new this.serialportClass(com, { baudRate: baudrate });
    this.serialport.on('data', (data) => {
      this.dataEmitter.emit(data.toString());
    });
  }

  public closePort(): void {
    if (this.serialport) {
      this.serialport.close();
      this.serialport.destroy();
      this.serialport = null;
    }
  }
}
