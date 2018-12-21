import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { MatDialog } from '@angular/material';
import { PortDialogComponent } from '../components/dialog/port-dialog/port-dialog.component';
import { SerialportService } from './serialport.service';

@Injectable({
  providedIn: 'root'
})
export class MenuItemListenerService {

  constructor(private electronService: ElectronService, private dialog: MatDialog, private serialportService: SerialportService) {
    this.electronService.ipcRenderer.on('openPort', () => {
      this.openPortDialog();
    });
    this.electronService.ipcRenderer.on('closePort', () => {
      this.serialportService.closePort();
    });
  }

  private openPortDialog(): void {
    this.dialog.open(PortDialogComponent, {
      width: '400px'
    });
  }
}
