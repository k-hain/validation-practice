import './style.css';
import PubSub from 'pubsub-js';
import countries from 'country-json/src/country-by-name.json';

/* global document */

const formEl = document.querySelector('form');
const formInputs = [];

const PASSWORD_UPDATE = 'PASSWORD UPDATE';

let countryNames = '';
countries.forEach((entry) => {
    let updatedNames = countryNames.concat('|', entry.country);
    countryNames = updatedNames;
})

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

class FormInputCountry extends FormInput {
    constructor(nameStr, nameClass) {
        super(nameStr, nameClass);
        this.inputEl.setAttribute('pattern', countryNames);
        this.constraintList.push(
            {
                name: 'patternMismatch',
                message: `Entered value needs to be a valid country name.`,
            }
        );
    }
}

class FormInputPostalCode extends FormInput {
    constructor(nameStr, nameClass) {
        super(nameStr, nameClass);
        this.inputEl.setAttribute('pattern', '[0-9]{2}-[0-9]{3}');
        this.constraintList.push(
            {
                name: 'patternMismatch',
                message: `Entered value needs to be a valid postal code containing exactly 5 digits (e.g. 12-345).`,
            }
        );
    }
}

class FormInputPassword extends FormInput {
    validateInput() {
        PubSub.publish(PASSWORD_UPDATE, this.inputEl.value);
        super.validateInput();
    }
}

class FormInputPasswordConfirmation extends FormInput {
    constructor(nameStr, nameClass) {
        super(nameStr, nameClass);
        this.constraintList.push(
            {
                name: 'patternMismatch',
                message: `Entered value needs to match the password.`,
            }
        );
    }

    updatePassword = (PASSWORD_UPDATE, newPassword) => {
        this.inputEl.setAttribute('pattern', `${newPassword}`);
        if (this.inputEl.value !== '') {
            this.validateInput();
        }; 
    }
    tokenUpdatePassword = PubSub.subscribe(PASSWORD_UPDATE, this.updatePassword);
}

const emailInput = new FormInput('email address', 'email');
const countryInput = new FormInputCountry('country', 'country');
const postalCodeInput = new FormInputPostalCode('postal code', 'postal-code');
const passwordInput = new FormInputPassword('password', 'password');
const passwordConfirmationInput = new FormInputPasswordConfirmation('password confirmation', 'password-confirmation');

formInputs.push(emailInput, countryInput, postalCodeInput, passwordInput, passwordConfirmationInput);

formEl.addEventListener('submit', (event) => {
    formInputs.forEach((formInput) => {
        if (!formInput.inputEl.validity.valid) {
            formInput.showError();
            event.preventDefault();
        }
    });
});
