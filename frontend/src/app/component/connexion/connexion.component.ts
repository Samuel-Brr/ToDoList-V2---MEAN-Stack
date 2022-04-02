import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, throwError, tap } from 'rxjs';
import { AuthStore } from 'src/app/auth.store';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private authStore: AuthStore,
    private router: Router) { }

  form = this.fb.group({
  email:['', Validators.required],
  mdp:['', [Validators.required,
      Validators.minLength(4)]],
  })

  ngOnInit(): void {
  }


  connexion(form: FormGroup){
    const email = form.value.email
    const mdp = form.value.mdp

    this.authStore.login(email,mdp)
    .pipe(
      catchError(err => {
        return throwError(() => {
          new Error(err)
          alert("Connexion impossible")
        })
      }),
      tap(val =>{
        this.router.navigateByUrl('/')
      })
    )
      .subscribe()
  }
}
