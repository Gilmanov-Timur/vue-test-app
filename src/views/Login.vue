<template>
	<div class="login">
		<div class="card">
			<h1>Авторизация</h1>

			<form @submit.prevent="onSubmit">
				<div class="form-control" :class="{invalid: errors.login}">
					<label for="login">Логин</label>
					<input type="text" id="login" v-model.trim="form.login">
					<small v-if="errors.login">
						{{ errors.login }}
					</small>
				</div>

				<div class="form-control" :class="{invalid: errors.password}">
					<label for="password">Пароль</label>
					<div class="relative">
						<input
							:type="passwordVisible ? 'text' : 'password'"
							id="password"
							v-model.trim="form.password"
						>
						<div
							class="icon"
							:class="{crossed: passwordVisible}"
							@click="passwordVisible = !passwordVisible"
						>
							&#128065;
						</div>
					</div>
					<small v-if="errors.password">
						{{ errors.password }}
					</small>
				</div>

				<button type="submit" class="btn primary">
					Войти
				</button>
			</form>
		</div>
	</div>
</template>

<script>
import { mapActions } from 'pinia'
import { useUserStore } from '@/stores/user'
export default {
	data() {
		return {
			submitted: false,
			form: {
				login: '',
				password: '',
			},
			errors: {
				login: null,
				password: null,
			},
			passwordVisible: false,
		}
	},
	methods: {
		...mapActions(useUserStore, ['login']),
		validateForm() {
			let isValid = true

			if (!this.form.login) {
				this.errors.login = 'Введите логин'
				isValid = false
			} else if (this.form.login.length < 6) {
				this.errors.login = 'Длина поля не менее 6 символов'
				isValid = false
			} else {
				this.errors.login = null
			}

			if (!this.form.password) {
				this.errors.password = 'Введите пароль'
				isValid = false
			} else if (this.form.password.length < 6) {
				this.errors.password = 'Длина поля не менее 6 символов'
				isValid = false
			} else {
				this.errors.password = null
			}

			return isValid
		},
		onSubmit() {
			this.submitted = true
			if (this.validateForm()) {
				this.login(this.form.login)
				this.$router.replace('/')
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

<style scoped>
.login {
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto;
	width: 100%;
	max-width: 500px;
	min-height: calc(100vh - 5rem);
}
.icon {
	position: absolute;
	right: 0.5rem;
	top: 50%;
	font-size: 1.5rem;
	line-height: 1;
	transform: translateY(-50%);
	cursor: pointer;
}
.icon.crossed:after {
	content: '—';
	position: absolute;
	right: 0;
	top: 0;
	transform: rotate(-45deg);
}
</style>
