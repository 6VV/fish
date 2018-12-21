import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { SerialportService } from '../../../providers/serialport.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-port-dialog',
  templateUrl: './port-dialog.component.html',
  styleUrls: ['./port-dialog.component.scss']
})
export class PortDialogComponent implements OnInit {
  portControl = new FormControl('', [Validators.required]);

  portNames: string[] = [];
  baudrates: number[] = [300, 600, 1200, 2400, 4800, 9600, 19200, 38400, 43000, 56000, 57600, 115200];

  portSelected = '';
  baudrateSelected = 115200;

  constructor(private dialogRef: MatDialogRef<PortDialogComponent>,
    private serialportService: SerialportService) { }

  ngOnInit() {
    this.serialportService.getSerialPortClass().list((error, ports) => {
      ports.forEach((port) => {
        this.portNames.push(port.comName);
      });
    });
  }

  confirm() {
    if (this.portControl.invalid) {
      return;
    }
    this.serialportService.createPort(this.portSelected, this.baudrateSelected);
    console.log(this.portSelected);
    console.log(this.baudrateSelected);
    this.dialogRef.close();
  }

}
