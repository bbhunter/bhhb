import { Component, OnInit, ViewChild } from '@angular/core';
import { FileHandleService } from '../../services/file-handle/file-handle.service'
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private FileHandleService: FileHandleService) { }

  fileSub!: Subscription
  selectedFileName!: string;
  selectedFileContent!: object
  displayedColumns: string[] = ['position', 'host', 'method', 'path', 'status', 'responselength', 'mimetype', 'extension', 'comment', 'ip', 'time', 'port'];
  dataSource = new MatTableDataSource();
  ELEMENT_DATA: any = [];

  ngOnInit(): void {
    this.fileSub = this.FileHandleService.getselectedFileDataListener()
      .subscribe((selectedFileData: { selectedFileName: string, selectedFileContent: object }) => {
        this.selectedFileName = selectedFileData.selectedFileName
        this.selectedFileContent = selectedFileData.selectedFileContent
        console.log(this.selectedFileContent);
        this.elementDataGen(this.selectedFileContent)
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource.sort = this.sort;
      })
  }

  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  elementDataGen(content: any) {
    this.ELEMENT_DATA = []
    content.items.item.forEach((element: any) => {
      this.ELEMENT_DATA.push(
        {
          ip: element.host[0].$.ip,
          host: element.protocol + '://' + element.host[0]._,
          port: element.port,
          protocol: element.protocol,
          method: element.method,
          status: element.status,
          path: element.path,
          responselength: element.responselength,
          comment: element.comment,
          url: element.url,
          time: element.time,
          mimetype: element.mimetype,
          extension: element.extension != 'null' ? element.extension : ''
        }
      )
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }
}
