//#region 1. MODELO DE DATOS (MODELS)
// clase task

class Task {
    constructor(id, title, description, completed, priority, tag, dueDate) {
      this.id = id; 
      this.title = title; 
      this.description = description; 
      this.completed = completed; 
      this.priority = priority; 
      this.tag = tag; 
      this.dueDate = dueDate; 
    }
}

function mapAPIToTasks(data) {
    return data.map(item => {
      return new Task(
        item.id,
        item.title,
        item.description,
        item.completed, 
        item.priority,
        item.tag, 
        new Date(item.dueDate),
      );
    });
}

function APIToTask(data) {
    return new Task(
      data.id,
      data.title,
      data.description,
      data.completed,
      data.priority,
      data.tag,
      new Date(data.dueDate),
    );
}

//#endregion

//#region 2. Task (VIEW)

function displayTasksView(tasks) {

    clearTable();
  
    showLoadingMessage();
  
    if (tasks.length === 0) {
  
      showNotFoundMessage();
  
    } else {
  
      hideMessage();
  
      displayTasksTable(tasks);
    }
  
}

function displayTasksTable(tasks) {

    const tablaBody = document.getElementById('data-table-body');
  
    tasks.forEach(task => {
  
      const row = document.createElement('tr');
      
      if (task.completed) {
        row.style.textDecoration='line-through';

      }
      row.innerHTML = `
        <td><input class="status-checkbox" type='checkbox' data-task-id="${task.id}" ${checked(task.completed)} >${isComplete(task.completed)}</input></td>
        <td>${task.title}</td>
        <td>${task.description}</td>
        <td>${formatDate(task.dueDate)}</td>
        <td>${task.priority}</td>
        <td>${task.tag}</td>
        <td>
          <button class="btn-update fa-solid fa-pen" data-task-id="${task.id}"></button>
        </td>
        <td>
          <button class="btn-delete fa-solid fa-trash" data-task-id="${task.id}"></button>
        </td>
      `;
  
      tablaBody.appendChild(row);
  
    });

    initDeleteTaskButtonHandler();
    initUpdateTaskButtonHandler();
}

function clearTable() {
    const tableBody = document.getElementById('data-table-body');
  
    tableBody.innerHTML = '';
}

function showLoadingMessage() {
    const message = document.getElementById('message');
  
    message.innerHTML = 'Cargando...';
  
    message.style.display = 'block';
}

function showInitialMessage() {
  const message = document.getElementById('message');

  message.innerHTML = 'no se han creado tareas.';

  message.style.display = 'block';
}

function showNotFoundMessage() {
    const message = document.getElementById('message');
  
    message.innerHTML = 'no hay tareas.';
  
    message.style.display = 'block';
}

function hideMessage() {
    const message = document.getElementById('message');
  
    message.style.display = 'none';
}

//#endregion

//#region 3. FILTROS (VIEW)

function initFilterButtonsHandler() {

    document.getElementById('filter-form').addEventListener('submit', event => {
      console.log('entre');
      event.preventDefault();
      searchTasks();
    });
  
    document.getElementById('open-filters').addEventListener('click', event => {
      openCloseFilters();
    });
    
    document.getElementById('reset-filters').addEventListener('click', () => resetTasks());
  
}

function openCloseFilters(){
  let show= document.getElementById('tag-filter').style.display;
  show=showHide(show);
  document.getElementById('tag-filter').style.display=show;
  document.getElementById('status-filter').style.display=show;
  document.getElementById('apply-filters').style.display=show;
  document.getElementById('status-label-field').style.display=show;
  if (show=='none') {
    resetTasks();
  }
}

function showHide(show){
  
  if (show=='none' || show=='') {
    return 'initial';
  }else{
    return 'none';
  }
}

function resetTasks() {
  
    document.querySelectorAll('input.filter-field').forEach(input => input.value = '');
    document.querySelectorAll('input.filter-field').forEach(input => input.checked = false);
    document.querySelectorAll('select.filter-field').forEach(select => select.value = '');
    document.getElementById('tag-filter').style.display='none';
    document.getElementById('status-filter').style.display='none';
    document.getElementById('apply-filters').style.display='none';
    document.getElementById('status-label-field').style.display='none';
    searchTasks();
}

function searchTasks() {
    
    const tag = document.getElementById('tag-filter').value;
    const completed = document.getElementById('status-filter').checked;

    getTasksData(tag,completed);
}
  
//#endregion

//#region 4. BOTONES PARA AGREGAR, ACTUALIZAR Y ELIMINAR TAREAS (VIEW)

function initTaskButtonsHandler() {

    document.getElementById('process-task').addEventListener('click', () => {
      closeTaskModal()
      openTaskModal()
    });
  
    document.getElementById('modal-background').addEventListener('click', () => {
      closeTaskModal();
    });

    document.getElementById('status-field').addEventListener('change', () => {
      const checkbox=document.getElementById('status-field');
      const p=document.getElementById('status-p-field');
      p.textContent=isComplete(checkbox.checked);
    });
  
    document.getElementById('sale-form').addEventListener('submit', event => {
 
      event.preventDefault();
      processTask();
    });
  
}

function openTaskModal(data) {
  document.getElementById('sale-form').reset();
  document.getElementById('modal-background').style.display = 'block';
  document.getElementById('modal').style.display = 'block';

  if (data) {
    document.getElementById('id-field').value=data.id;
    document.getElementById('modal-title').textContent='actualizar tarea';
    document.getElementById('title-field').value=data.title;
    document.getElementById('description-field').value=data.description;
    document.getElementById('status-field-label').style.display='initial';
    document.getElementById('status-field').style.display='initial';
    document.getElementById('status-field').checked=data.completed;
    document.getElementById('status-p-field').style.display='initial';
    document.getElementById('status-p-field').textContent=isComplete(data.completed);
    document.getElementById('priority-field').value=data.priority;
    document.getElementById('tag-field').value=data.tag;
    const dueDate2 = new Date(data.dueDate);
    const formattedDueDate = dueDate2.toISOString().substring(0, 10);
    document.getElementById('date-field').value=formattedDueDate
    document.getElementById('botonModal').textContent='guardar cambios';
  }
}

function closeTaskModal() {
    document.getElementById('modal-title').textContent='nueva tarea';
    document.getElementById('status-field-label').style.display='none';
    document.getElementById('status-field').style.display='none';
    document.getElementById('status-p-field').style.display='none';
    document.getElementById('sale-form').reset();
    document.getElementById('modal-background').style.display = 'none';
    document.getElementById('modal').style.display = 'none';
    document.getElementById('botonModal').textContent='guardar tarea';
}

function processTask() {
    const title = document.getElementById('title-field').value;
    const description = document.getElementById('description-field').value;
    const priority = document.getElementById('priority-field').value;
    const tag = document.getElementById('tag-field').value;
    const dueDate = document.getElementById('date-field').value;

    const cambio=document.getElementById('botonModal').textContent;
    let id;
    let completed;
    if (cambio=='guardar cambios') {
      id = document.getElementById('id-field').value; 
      completed = document.getElementById('status-field').checked;
    }else {
      id = null;
      completed = false;
    }

    const taskToSave = new Task(
      id,
      title,
      description,
      completed, 
      priority,
      tag, 
      dueDate
    );

    if (cambio=='guardar cambios') {
      updateTask(taskToSave);
    }else {
      createTask(taskToSave);
    }
    
}

function initDeleteTaskButtonHandler() {

  document.querySelectorAll('.btn-delete').forEach(button => {

    button.addEventListener('click', () => {

      const taskId = button.getAttribute('data-task-id'); 
      deleteTask(taskId); 

    });

  });

}

function initUpdateTaskButtonHandler() {
  document.querySelectorAll('.btn-update').forEach(button => {

    button.addEventListener('click', () => {

      const taskId = button.getAttribute('data-task-id'); 
      getTask(taskId); 
    });

  });

  document.querySelectorAll('.status-checkbox').forEach(checkbox => {

    checkbox.addEventListener('change', () => {

      const taskId = checkbox.getAttribute('data-task-id'); 
      getTaskCheckbox(taskId,checkbox.checked); 
    });

  });

}


//#endregion

//#region 5. CONSUMO DE DATOS DESDE API

function getTasksData(tag,completed) {

  const url = buildGetTasksDataUrl(tag,completed);

  fetchAPI(url, 'GET')
    .then(data => {
      
      const tasksList = mapAPIToTasks(data);
      displayTasksView(tasksList);
    });
}

function getTask(id) {
  fetchAPI(`${apiURL}/users/219218550/tasks/${id}`, 'GET')
    .then(data => {
      openTaskModal(data)
    });
  
}

function getTaskCheckbox(id,checked) {
  fetchAPI(`${apiURL}/users/219218550/tasks/${id}`, 'GET')
    .then(data => {
      const task=APIToTask(data)
      task.completed=checked;
      updateTask(task);
    });
  
}


function createTask(task) {

  fetchAPI(`${apiURL}/users/219218550/tasks`, 'POST', task)
    .then(task => {
      closeTaskModal();
      resetTasks();
      console.log(task.id);
      window.alert(`Tarea ${task.id} creada correctamente.`);
    });

}

function updateTask(task) {

  fetchAPI(`${apiURL}/users/219218550/tasks/${task.id}`, 'PUT',task)
    .then(task => {
      closeTaskModal();
      resetTasks();
      window.alert(`Tarea ${task.id} actualizada correctamente.`);
    });

}

function deleteTask(taskId) {

  const confirm = window.confirm(`¿Estás seguro de que deseas eliminar la tarea ${taskId}?`);

  if (confirm) {

    fetchAPI(`${apiURL}/users/219218550/tasks/${taskId}`, 'DELETE')
      .then(() => {
        resetTasks();
        window.alert("Tarea eliminada.");
      });

  }
}

function buildGetTasksDataUrl(tag,completed) {

  const url = new URL(`${apiURL}/users/219218550/tasks`);
  if (tag) {
    url.searchParams.append('tag', tag);
  }

  if (completed) {
    url.searchParams.append('completed', completed);
  }

  return url;
}



//#endregion

//#region 6. INICIALIZAR CONTROLADORES

initTaskButtonsHandler();

initFilterButtonsHandler();

getTasksData();

//#endregion