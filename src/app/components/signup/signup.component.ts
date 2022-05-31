import { Component, OnInit, OnDestroy } from '@angular/core';
import { Country } from 'src/app/model/country';
import { MyApisService } from 'src/app/services/my-apis.service';
import { FormControl, FormGroup, Validators, FormBuilder, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { merge, Subscription, Subject } from 'rxjs';
import { mapTo, takeUntil } from 'rxjs/operators';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  countries: Country[];
  countryCode: string;
  signupForm: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private api: MyApisService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }


  //to prevent the user from typing any arabic input in name input field
  disableArabic(event: any) {
    const arabicRegex = /[\u0600-\u06ff]|[\u0750-\u077f]|[\ufb50-\ufbc1]|[\ufbd3-\ufd3f]|[\ufd50-\ufd8f]|[\ufd92-\ufdc7]|[\ufe70-\ufefc]|[\uFDF0-\uFDFD]/;
    if (arabicRegex.test(event.key)) {
      event.preventDefault();
    }
    console.log(event)
  }

  onSubmit() {
    if (!this.signupForm.valid) {
      return;
    }
    console.log(this.signupForm.value);
    localStorage.setItem('user', JSON.stringify(this.signupForm.value));
    this.router.navigateByUrl('welcome')

  }


  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, nameValidator]],
      nationality: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    },
      {
        validators: mustMatch('password', 'confirmPassword')
      }
    )




    //Getting list of countires from api, and passing them to select input
    this.api.getCountries().pipe(takeUntil(this.destroy$)).subscribe(
      data => this.countries = data
    )

    //Getting User's Country Key Code, and updating the select value in form to display user's country by default
    this.api.getCountryKeyCode().pipe(takeUntil(this.destroy$)).subscribe(
      data => {
        this.signupForm.patchValue({ nationality: data.country_code })
      }
    )



  }

  ngOnDestroy() {
    // To Stop all the subscriptions handled with 'takeUntil'
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}

//Name Validation, To make sure name input only has english letters and space
function nameValidator(control: AbstractControl): ValidationErrors | null {
  const name: string = control.value;
  const regex = /^[a-zA-Z\s]*$/;
  if (regex.test(name)) {
    return null;
  } else {
    return { 'validName': true };
  }
}

//Confirm Password Validation, To ensure that password and confirm passwords input fields are the same
function mustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      return;
    }

    if (control.value === matchingControl.value) {
      matchingControl.setErrors(null);
    } else {
      matchingControl.setErrors({ mustMatch: true });
    }
    return null;
  };
}

