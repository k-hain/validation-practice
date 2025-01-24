import './style.css';

/* global document */

const formEl = document.querySelector('form');
const formInputs = [];


class FormInput {   
    constructor(nameStr, nameClass) {
        this.name = nameStr;
        this.inputEl = document.getElementById(`${nameClass}`);
        this.errorEl = document.querySelector(`.${nameClass} .error`);

        this.constraintList = [
            {
                name: 'valueMissing',
                message: `This field cannot be empty.`,
            },
            {
                name: 'typeMismatch',
                message: `Entered value needs to be a valid ${this.name}.`,
            }
        ];

        this.inputEl.addEventListener('input', () => {
            this.validateInput();
        });
    }

    showError() {
        this.constraintList.forEach((constraint) => {
            if (this.inputEl.validity[`${constraint.name}`]) {
                this.errorEl.textContent = constraint.message;
            }
        });

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

class FormInputPostalCode extends FormInput {
    constructor(nameStr, nameClass) {
        super(nameStr, nameClass);
        this.inputEl.setAttribute('pattern', '[0-9]{2}-[0-9]{3}');
        this.constraintList.push(
            {
                name: 'patternMismatch',
                message: `Entered value needs to be a valid ${this.name} containing exactly 5 digits (e.g. 12-345).`,
            }
        );
    }
}

const email = new FormInput('email address', 'email');
const country = new FormInput('country', 'country');
const postalCode = new FormInputPostalCode('postal code', 'postal-code');
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
