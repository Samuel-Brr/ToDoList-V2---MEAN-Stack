import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Task } from 'src/app/model/task';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  private subject = new BehaviorSubject<Task[]>([])
  taskArr$: Observable<Task[]> = this.subject.asObservable()

  taskObj:Task=new Task()

  addTaskValue:string=''
  editTaskValue:string=''

  constructor(private crudService: CrudService) { }

  ngOnInit(): void {
    this.taskObj = new Task();
    this.subject = new BehaviorSubject<Task[]>([])
    this.taskArr$ = this.subject.asObservable()
    this.getAllTasks()
  }


  getAllTasks() {
    this.crudService.getAllTasks()
      .pipe(
        catchError(err => {
          return throwError(() => {
            new Error(err)
            alert("Unable to get list of tasks")
          })
        }),
        tap(tasks => {
          this.subject.next(tasks)
        })
      )
      .subscribe()
  }

  addTask(){
    this.taskObj.content = this.addTaskValue
    this.crudService.addTask(this.taskObj)
      .pipe(
        catchError(err => {
          return throwError(() => {
            new Error(err)
            alert("Failed to add a task")
          })
        }),
        tap(task => {
          this.ngOnInit()
          this.addTaskValue=''
        }),
      )
      .subscribe()
  }

  editTask(){
    this.taskObj.content = this.editTaskValue
    this.crudService.editTask(this.taskObj)
      .pipe(
        catchError(err => {
          return throwError(() => {
            new Error(err)
            alert("Failed to update task")
          })
        }),
        tap(task => this.ngOnInit()),
      )
      .subscribe()
  }

  deleteTask(task:Task){
    this.crudService.deleteTask(task)
      .pipe(
        catchError(err => {
          return throwError(() => {
            new Error(err)
            alert("Failed to delete task")
          })
        }),
        tap(task => this.ngOnInit()),
      )
      .subscribe()
  }

  call(task: Task){
    this.taskObj = task
    this.editTaskValue = task.content
  }

}
