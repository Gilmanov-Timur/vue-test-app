<template>
	<div class="card">
		<h1>Тесты</h1>
		<div class="mb-1" v-if="tests.length">
			<div class="test" v-for="test in tests" :key="test.id">
				<div class="test-question">
					<div class="absolute w-100">
						<div class="test-text text-truncate">
							{{ test.question }}
						</div>
					</div>
				</div>
				<div class="test-actions">
					<button type="button" class="btn warning" @click="onEditTest(test)">Редактировать</button>
					<button type="button" class="btn danger" @click="deleteTest(test.id)">Удалить</button>
				</div>
			</div>
		</div>
		<h3 v-else>
			Тестов еще нет, добавьте первый.
		</h3>
		<div class="buttons">
			<button type="button" class="btn primary" @click="showModal = true">
				Добавить тест
			</button>
			<button type="button" class="btn primary" :disabled="!tests.length" @click="$router.push({name: 'quiz', params: {testId: tests[0].id}})">
				Решить тесты
			</button>
		</div>
	</div>

	<Modal v-if="showModal" @close="onModalClose">
		<AddEditTest @add="addTest" @edit="editTest" :selectedTest="selectedTest" />
	</Modal>
</template>

<script>
import {mapActions, mapState} from 'pinia'
import {useTestsStore} from '@/stores/tests'
import Modal from '@/components/Modal.vue'
import AddEditTest from '@/components/AddEditTest.vue'

export default {
	components: {
		Modal,
		AddEditTest,
	},
	data() {
		return {
			showModal: false,
			selectedTest: null,
		}
	},
	methods: {
		...mapActions(useTestsStore, {addToStore: 'add', editInStore: 'edit', deleteFromStore: 'delete'}),
		addTest(test) {
			this.addToStore(test)
			this.showModal = false
		},
		deleteTest(id) {
			const isDelete = confirm('Уверены что хотите удалить?')
			if (isDelete) {
				this.deleteFromStore(id)
			}
		},
		onEditTest(test) {
			this.selectedTest = test
			this.showModal = true
		},
		editTest(test) {
			this.editInStore(test)
			this.showModal = false
		},
		onModalClose() {
			this.showModal = false
			this.selectedTest = null
		}
	},
	computed: {
		...mapState(useTestsStore, ['tests']),
	}
}
</script>

<style>
.test {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	padding: 10px 0;
	width: 100%;
	border-bottom: 1px solid #eaecef;
}
.test-question {
	position: relative;
	flex-basis: 0;
	flex-grow: 1;
	width: 100%;
	max-width: 100%;
}

.test-text {
	position: absolute;
	left: 0;
	top: 50%;
	width: 100%;
	transform: translateY(-50%);
}

.test-actions {
	display: flex;
	gap: 10px;
	flex: 0 0 auto;
	padding-left: 10px;
	width: auto;
	max-width: 100%;
}
.buttons {
	display: flex;
	justify-content: space-between;
}
</style>