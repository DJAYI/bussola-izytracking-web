import { Component, inject, signal } from "@angular/core";
import { email, Field, form, minLength, required, submit } from "@angular/forms/signals";
import { LoginCredentials } from "../../models/login.interface";
import { AuthService } from "../../auth,service";


@Component({
    selector: 'app-login',
    template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <form (submit)="onSubmit($event)" class="bg-white p-8 rounded shadow-md w-full max-w-md">
            <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
            <div class="mb-4">
                <label for="email" class="block text-gray-700 font-bold mb-2">Email</label>
                <input id="email" type="email" [field]="loginForm.email" class="w-full p-2 border border-gray-300 rounded" />

                @if (loginForm.email().touched() && loginForm.email().invalid()) {
                    <ul>
                        @for (error of loginForm.email().errors(); track error) {
                            <li class="text-red-500 text-sm">- {{ error.message }}</li>
                        }
                    </ul>
                }
            </div>
            <div class="mb-6">
                <label for="password" class="block text-gray-700 font-bold mb-2">Password</label>
                <input id="password" type="password" [field]="loginForm.password" class="w-full p-2 border border-gray-300 rounded" />

                @if (loginForm.password().touched() && loginForm.password().invalid()) {
                    <ul>
                        @for (error of loginForm.password().errors(); track error) {
                            <li class="text-red-500 text-sm">- {{ error.message }}</li>
                        }
                    </ul>
                }
            </div>
            <button [disabled]="loginForm().invalid()" type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Login</button>
        </form>
    </div>
    `,
    imports: [Field]
})

export class LoginPage {
    authService = inject(AuthService);

    credentials = signal<LoginCredentials>({
        email: '',
        password: ''
    });

    loginForm = form(this.credentials, (schemaPath) => {
        required(schemaPath.email, { message: 'Email is required' });
        required(schemaPath.password, { message: 'Password is required' });

        email(schemaPath.email, { message: 'Invalid email format' });

        minLength(schemaPath.password, 8, { message: 'Password must be at least 8 characters long' });
        minLength(schemaPath.email, 5, { message: 'Email must be at least 5 characters long' });
    });

    onSubmit(event: Event) {
        event.preventDefault();
        submit(this.loginForm, async () => {
            this.authService.login(this.credentials()).subscribe({
                next: (response) => {
                    console.log('Login successful', response);
                    this.authService.currentUser = response;
                },
                error: (error) => {
                    console.error('Login failed', error);
                }
            });
        })
    }
}