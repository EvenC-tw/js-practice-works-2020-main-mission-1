const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const data = {
	newTodo: '',
	todoList: JSON.parse(localStorage.getItem('todoList')) || [],
}

function render() {
	const { todoList, newTodo } = data
	localStorage.setItem('todoList', JSON.stringify(todoList))

	$('#todoList').innerHTML = `${renderTodoList(todoList)}`
	$('#newTodo').value = newTodo
	const pendingTaskCount = todoList.filter((item) => !item.checkStatus).length
	const finishedTaskCount = todoList.filter((item) => item.checkStatus).length
	$('#pendingTaskCount').textContent = pendingTaskCount
	$('#finishedTaskCount').textContent = finishedTaskCount

	if (pendingTaskCount === 0 && finishedTaskCount === 0) {
		$('#taskCount').classList.add('d-none')
		$('#taskCount').classList.remove('d-flex')
	} else {
		$('#taskCount').classList.add('d-flex')
		$('#taskCount').classList.remove('d-none')
	}

	$('#clearTask').addEventListener('click', clearTodoList)
	$('#addTodo').addEventListener('click', addTodoListItem)
	$$('.deleteTodo').forEach((btn) => {
		btn.addEventListener('click', deleteTodoListItem)
	})
	$$('.checkTodo').forEach((btn) => {
		btn.addEventListener('click', checkTodoListItem)
	})
}

function renderTodoList(todoList) {
	return todoList
		.map(
			(item) =>
				`<li class='list-group-item list-group-item-action d-flex justify-content-between align-items-center${
					item.checkStatus ? ' list-group-item-success' : ''
				}' data-check='${item.checkStatus}' data-id='${
					item.id
				}'><div class="form-check d-flex"><label class="d-flex align-items-center"><input type="checkbox" class="form-check-input checkTodo" aria-label="Checkbox"${
					item.checkStatus ? ' checked/>' : '/>'
				}${
					item.content
				}</label></div><button type="button" class="close px-3 deleteTodo" aria-label="Close"><span aria-hidden="true">&times;</span></button></li>`
		)
		.join('')
}

function clearTodoList() {
	data.todoList = []
	render()
}

function addTodoListItem() {
	const content = $('#newTodo').value
	data.todoList.push({
		content: content,
		checkStatus: false,
		id: getRandomId(),
	})
	data.newTodo = ''
	render()
}

function deleteTodoListItem(event) {
	const id = ~~event.target.closest('li').dataset.id
	data.todoList = data.todoList.filter((item) => item.id !== id)
	render()
}

function checkTodoListItem(event) {
	const id = ~~event.target.closest('li').dataset.id
	data.todoList.forEach((item) => {
		if (item.id === id) {
			item.checkStatus = !item.checkStatus
		}
	})
	render()
}

function getRandomId() {
	return Math.abs(~~(Math.random() * new Date().getTime()))
}

render()
