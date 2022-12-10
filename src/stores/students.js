import { defineStore } from 'pinia'

const saveStudents = students => localStorage.setItem('students', JSON.stringify(students))

export const useStudentsStore = defineStore('students', {
	state() {
		return {
			students: JSON.parse(localStorage.getItem('students')) || [],
		}
	},
	actions: { //methods
		add(student) {
			this.students.unshift({
				...student,
				id: Date.now()
			})
			saveStudents(this.students)
		},
		edit(student) {
			const index = this.students.findIndex(person => person.id === student.id)
			this.students.splice(index, 1, student)
			saveStudents(this.students)
		},
		delete(id) {
			const index = this.students.findIndex(person => person.id === id)
			this.students.splice(index, 1)
			saveStudents(this.students)
		}
	},
})
