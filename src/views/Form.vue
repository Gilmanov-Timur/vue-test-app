<template>
	<div class="card">
		<h1>Форма</h1>

		<form @submit.prevent="onSubmit">
			<div class="form-control" :class="{invalid: errors.name}">
				<label for="name">Имя</label>
				<input type="text" id="name" v-model.trim="form.name" placeholder="Василий">
				<small v-if="errors.name">
					{{ errors.name }}
				</small>
			</div>

			<div class="form-control" :class="{invalid: errors.phone}">
				<label for="phone">Телефон</label>
				<input type="tel" id="phone" v-model.trim="form.phone" maxlength="13" placeholder="+998123456789">
				<small v-if="errors.phone">
					{{ errors.phone }}
				</small>
			</div>

			<div class="form-control" :class="{invalid: errors.passport}">
				<label for="passport">Паспорт</label>
				<input type="text" id="passport" v-model.trim="form.passport" maxlength="9" placeholder="AA1234567">
				<small v-if="errors.passport">
					{{ errors.passport }}
				</small>
			</div>

			<div class="form-control" :class="{invalid: errors.pinfl}">
				<label for="pinfl">ПИНФЛ</label>
				<input type="text" id="pinfl" v-model.trim="form.pinfl" maxlength="14" placeholder="12345678901234">
				<small v-if="errors.pinfl">
					{{ errors.pinfl }}
				</small>
			</div>

			<div class="form-control" :class="{invalid: errors.birthdate}">
				<label for="birthdate">Дата рождения</label>
				<input type="date" id="birthdate" v-model.trim="form.birthdate">
				<small v-if="errors.birthdate">
					{{ errors.birthdate }}
				</small>
			</div>

			<button type="submit" class="btn primary">
				Отправить
			</button>
		</form>
	</div>
</template>

<script>
const phoneValidator = /^\+998\d{9}$/
const passportValidator = /^[A-Za-z]{2}\d{7}$/
const pinflValidator = /^\d{14}$/

export default {
	data() {
		return {
			submitted: false,
			form: {
				name: '',
				phone: '',
				passport: '',
				pinfl: '',
				birthdate: '',
			},
			errors: {
				name: null,
				phone: null,
				passport: null,
				pinfl: null,
				birthdate: null,
			},
		}
	},
	methods: {
		validateForm() {
			let isValid = true

			if (!this.form.name) {
				this.errors.name = 'Введите имя'
				isValid = false
			} else {
				this.errors.name = null
			}

			if (!this.form.phone) {
				this.errors.phone = 'Введите телефон'
				isValid = false
			} else if (!phoneValidator.test(this.form.phone)) {
				this.errors.phone = 'Не верный формат'
				isValid = false
			} else {
				this.errors.phone = null
			}

			if (!this.form.passport) {
				this.errors.passport = 'Введите серию и номер паспорта'
				isValid = false
			} else if (!passportValidator.test(this.form.passport)) {
				this.errors.passport = 'Не верный формат'
				isValid = false
			} else {
				this.errors.passport = null
			}

			if (!this.form.pinfl) {
				this.errors.pinfl = 'Введите ПИНФЛ'
				isValid = false
			} else if (!pinflValidator.test(this.form.pinfl)) {
				this.errors.pinfl = 'Не верный формат'
				isValid = false
			} else {
				this.errors.pinfl = null
			}

			if (!this.form.birthdate) {
				this.errors.birthdate = 'Введите дату рождения'
				isValid = false
			} else if (new Date(this.form.birthdate).getFullYear() < 1900) {
				this.errors.birthdate = 'Люди столько не живут'
			} else {
				this.errors.birthdate = null
			}

			return isValid
		},
		onSubmit() {
			this.submitted = true
			if (this.validateForm()) {
				alert('Форма валидна!')
			}
		},
	},
	watch: {
		form: {
			handler() {
				if (this.submitted) {
					this.validateForm()
				}
			},
			deep: true
		},
	}
}
</script>
