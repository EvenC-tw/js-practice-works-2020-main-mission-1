const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
let data = {
	todoList: [
		{
			content: '第一個todo',
			checkStatus: false,
			id: getRandomId(),
		},
		{
			content: '第二個todo',
			checkStatus: true,
			id: getRandomId(),
		},
	],
}
function render() {
	const { todoList } = data
	$('#todoList').innerHTML = `${renderTodoList(todoList)}`
	$('#taskCount').textContent = todoList.filter((item) => !item.checkStatus).length
	$('#clearTask').addEventListener('click', clearTodoList)
	$('#addTodo').addEventListener('click', addTodoListItem)
	$$('.deleteTodo').forEach((btn) => {
		console.log(btn)
		btn.addEventListener('click', deleteTodoListItem)
	})
}

function renderTodoList(todoList) {
	return todoList
		.map(
			(item) =>
				`<li class='list-group-item list-group-item-action d-flex justify-content-between align-items-center${
					item.checkStatus ? ' list-group-item-success' : ' disabled'
				}' data-check='${item.checkStatus}' ${item.checkStatus ? '' : ' aria-disabled="true"'}>${
					item.content
				}<button class="btn btn-danger deleteTodo${
					item.checkStatus ? ' d-none' : ''
				}" data-id='${item.id}'>delete</button></li>`
		)
		.join('')
}

function clearTodoList() {
	data.todoList = []
	render()
}

function addTodoListItem() {
	const newTodo = $('#newTodo').value
	data.todoList.push({
		content: newTodo,
		checkStatus: false,
		id: getRandomId(),
	})
	render()
}

function deleteTodoListItem(event) {
	const id = ~~event.target.dataset.id
	data.todoList = data.todoList.filter((item) => item.id !== id)
	render()
}

function getRandomId() {
	return Math.abs(~~(Math.random() * new Date().getTime()))
}
render()
