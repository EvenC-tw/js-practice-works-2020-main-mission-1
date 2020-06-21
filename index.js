/*
declarations
把全域都要用的東西先定義
 */
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const data = {
	newTodo: '',
	todoList: JSON.parse(localStorage.getItem('todoList')) || [],
	clearModal: {
		status: false,
	},
}

/*
method
主要渲染
 */
function render() {
	const { todoList, newTodo, clearModal } = data
	localStorage.setItem('todoList', JSON.stringify(todoList))

	$('#todoList').innerHTML = renderTodoList(todoList)
	$('#taskCount').outerHTML = renderTaskCount(todoList)
	$('#newTodo').value = newTodo
	$('#clearTodoListModal').outerHTML = renderClearModal(clearModal)

	$('#clearTask') && $('#clearTask').addEventListener('click', toggleClearModal)
	$('#addTodo').addEventListener('click', addTodoListItem)
	$('#newTodo').addEventListener('keydown', addTodoListItem)
	$('#todoList').addEventListener('click', deleteTodoListItem)
	$('#todoList').addEventListener('click', checkTodoListItem)

	$$('[data-dismiss=clearTodoListModal]').forEach((element) => {
		element.addEventListener('click', toggleClearModal)
	})
	$('[data-confirm=clearTodoListModal]').addEventListener('click', clearTodoList)
}

/*
method
列表部分渲染
 */
function renderTodoList(todoList) {
	const todayDate = new Date(new Date().toLocaleDateString())
	return todoList
		.map((item, index) => {
			const dateDiff = diffDate(new Date(item.date), todayDate)
			return `<li class='list-group-item list-group-item-action d-flex justify-content-between align-items-center${
				item.checkStatus ? ' list-group-item-success' : ''
			}' data-check='${item.checkStatus}' data-id='${
				index + 1
			}'><div class="form-check d-flex"><label class="d-flex align-items-center checkTodo label"><input type="checkbox" class="form-check-input checkTodo" aria-label="Checkbox"${
				item.checkStatus ? ' checked/>' : '/>'
			}${item.content}</label></div><div><small>${
				dateDiff ? dateDiff + ' days ago' : 'today'
			}</small><button type="button" class="close deleteTodo" aria-label="Close"><span class="deleteTodo px-3" aria-hidden="true">&times;</span></button></div></li>`
		})
		.join('')
}

/*
method
任務計算部分渲染
 */
function renderTaskCount(todoList) {
	const pendingTaskCount = todoList.filter((item) => !item.checkStatus).length
	const finishedTaskCount = todoList.filter((item) => item.checkStatus).length
	let result = `<div id="taskCount" class="card-footer d-flex justify-content-between align-items-center">
						<div class="d-flex flex-column align-items-start">`
	if (pendingTaskCount === 0 && finishedTaskCount === 0) {
		return `<div id="taskCount" class="card-footer d-none"></div>`
	} else if (pendingTaskCount !== 0 && finishedTaskCount === 0) {
		result += `<p id="pendingTaskCount" class="mb-0">還有 <span class="text-danger">${pendingTaskCount}</span> 筆任務未完成呀，加油!</p>`
	} else if (pendingTaskCount === 0 && finishedTaskCount !== 0) {
		result += `<p id="finishedTaskCount" class="mb-0">太棒了! <span class="text-success">${finishedTaskCount}</span> 筆任務全部完成囉!</p>`
	} else if (pendingTaskCount === 0 && finishedTaskCount === 0) {
		return ``
	} else {
		result += `	<p id="pendingTaskCount" class="mb-0">雖然還有<span class="text-danger"> ${pendingTaskCount} </span>筆任務未完成</p>
					<p id="finishedTaskCount" class="mb-0">但努力如你，已經完成 <span class="text-success">${finishedTaskCount}</span> 筆囉!</p>
				`
	}
	result += `</div><button type="button" id="clearTask" class="btn btn-warning">清空任務</button></div>`
	return result
}

/*
method
彈窗部分渲染
*/
function renderClearModal(clearModal) {
	const { status } = clearModal
	return `
		<div class="modal${status ? ' modal-show' : ''}" tabindex="-1" role="dialog" id="clearTodoListModal">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">要清除全部任務嗎?</h5>
						<button type="button" class="close" data-dismiss="clearTodoListModal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<p>點擊確定將會清除所有已完成和未完成的任務喔!</p>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-dismiss="clearTodoListModal">不要好了</button>
						<button type="button" class="btn btn-primary" data-confirm="clearTodoListModal">確定要清</button>
					</div>
				</div>
			</div>
		</div>
`
}

/*
method
幫event handler包一層proxy
在每次資料變更後固定去做
1. 資料排序
2. 畫面渲染
[TODO]亂寫的，還要再檢查有沒有隱藏問題..
 */
function handlerProxy(callback, event) {
	return function () {
		if (callback && typeof callback === 'function') {
			callback(event)
			sortList()
			render()
		}
	}
}

/*
method
排序順序
時間排序(從上而下由遠到近)
狀態排序(從上而下由未完成到已完成)
 */
function sortList() {
	data.todoList.sort((a, b) => {
		if (diffDate(new Date(a.date), new Date(b.date)) < 0) return 1
		else if (diffDate(new Date(a.date), new Date(b.date)) > 0) return -1
		else return 0
	})
	data.todoList.sort((a, b) => {
		if (a.checkStatus && !b.checkStatus) return 1
		else if (!a.checkStatus && b.checkStatus) return -1
		else return 0
	})
}

/*
method
時間比較
 */
function diffDate(d1, d2) {
	return Math.round((d2 - d1) / (1000 * 60 * 60 * 24))
}

/*
event handler
清除所有任務
 */
const clearTodoList = handlerProxy(() => {
	data.todoList = []
	data.clearModal.status = false
})

/*
event handler
新增單一任務
 */
const addTodoListItem = handlerProxy(() => {
	const content = $('#newTodo').value.trim()
	if ((event.type === 'click' || event.keyCode === 13) && content !== '') {
		data.todoList.push({
			content: content,
			checkStatus: false,
			date: new Date().toLocaleDateString(),
		})
		data.newTodo = ''
	} else {
		data.newTodo = content
	}
})

/*
event handler
刪除單一任務
 */
const deleteTodoListItem = handlerProxy(() => {
	event.preventDefault()
	if (event.target.classList.contains('deleteTodo')) {
		const id = ~~event.target.closest('li').dataset.id
		data.todoList = data.todoList.filter((item, index) => index + 1 !== id)
	}
})

/*
event handler
確認完成單一任務
 */
const checkTodoListItem = handlerProxy(() => {
	event.preventDefault()
	if (event.target.classList.contains('checkTodo')) {
		const id = ~~event.target.closest('li').dataset.id
		data.todoList.forEach((item, index) => {
			if (index + 1 === id) {
				item.checkStatus = !item.checkStatus
			}
		})
	}
})

/*
event handler
關閉彈窗
 */
const toggleClearModal = handlerProxy(() => {
	data.clearModal.status = !data.clearModal.status
})

render()
