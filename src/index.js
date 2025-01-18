import './style.css';

/* global document */

const formEl = document.querySelector('form');
const formInputs = [];

class FormInput {
    constructor(nameStr, nameClass) {
        this.name = nameStr;
        this.inputEl = document.getElementById(`${nameClass}`);
        this.errorEl = document.querySelector(`.${nameClass} .error`);

        this.inputEl.addEventListener('input', () => {
            this.validateInput();
        });
    }

    showError() {
        if (this.inputEl.validity.valueMissing) {
            this.errorEl.textContent = `This field cannot be empty.`;
        } else if (this.inputEl.validity.typeMismatch) {
            this.errorEl.textContent = `Entered value needs to be a valid ${this.name}.`;
        }
        this.errorEl.classList.add('active');
    }

    validateInput() {
        if (this.inputEl.validity.valid) {
            this.errorEl.textContent = '';
            this.errorEl.classList.remove('active');
        } else {
            this.showError();
        }
    }
}

const email = new FormInput('email address', 'email');
const country = new FormInput('country', 'country');
const postalCode = new FormInput('postal code', 'postal-code');
const password = new FormInput('password', 'password');
formInputs.push(email, country, postalCode, password);

formEl.addEventListener('submit', (event) => {
    formInputs.forEach((formInput) => {
        if (!formInput.inputEl.validity.valid) {
            formInput.showError();
            event.preventDefault();
        }
    });
});
