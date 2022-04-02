import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { AuthStore } from 'src/app/auth.store';


@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent implements OnInit {

  constructor(private fb: FormBuilder,
              private authStore: AuthStore,
              private router: Router) { }

  form = this.fb.group({
    email:['', Validators.required],
    mdp:['', [Validators.required,
              Validators.minLength(4)]],
    confirmMdp:['', Validators.required]
  })


  ngOnInit(): void {
  }

  inscription(form: FormGroup){
    const email = form.value.email
    const mdp = form.value.mdp

    this.authStore.signup(email, mdp)
      .pipe(
        catchError(err => {
          return throwError(() => {
            new Error(err)
            alert("Inscription impossible")
          })
        }),
        tap(val =>{
          this.router.navigateByUrl('/connexion')
        })
      )
      .subscribe()
  }

}
