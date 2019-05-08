/* 
Background:
We're building a todo list that has todos that can be infinitely nested. 
We will start by recreating the todo list we created in practical javascript.
We will then add nesting functionality 

Requirements (v1):
- it should have a place to store todos
- it should be able to display todos
- it shold be able to add new todos
- it should be able to change todos
- it should be able to delete todos

Requirements (v2):
- it should have one constant input field at the top that is used exclusively for creating new todos
- it should write the new Todo to the unordered list
- it should have a delete button and a toggle completed button on each todo
- it should also create an input field which each todo that has 2 purposes
  - when 'enter' is pressed, it will change that todo
  - when 'down arrow' is pressed, it will nest that todo
  - input field needs access to the li item
    - it has access to its position
    - it needs access to its specific value

Requirements (v3):
- it should have an inputfield with each todo that listens for a down arrow
- it should have a function that is called when down arrow is pressed on the inputfield of that todo element
- 
*/


var todoList = {
  todos: []
}

var methods = {

  addTodo: function(newTodo) {
    todoList.todos.push({
      todoText: newTodo, 
      completed: false,
    });
  },

  changeTodo: function(position, newTodo) {
    todoList.todos[position].todoText = newTodo;
  },

  deleteTodo: function(position) {
    todoList.todos.splice(position, 1);
  },

  toggleCompleted: function(position) {
    todoList.todos[position].completed = !todoList.todos[position].completed;
  },

  toggleAll: function() {
    var trueCounter = 0;
    todoList.todos.forEach(function(element) {
      if (element.completed === true) {
        trueCounter++;
      }
    })
    if (trueCounter === todoList.todos.length) {
      todoList.todos.forEach(function(element) {
        element.completed = false;
      })} else {
        todoList.todos.forEach(function(element) {
          element.completed = true;
      })
    }
  },

  nestTodo: function(position, subTodo) {
    //likely need to recurse here
    todoList.todos[position].subtask = 
    [
      {
        todoText: subTodo,
        completed: false
      }
    ]
  }
}

var handlers = {

  changeTodo: function(position, inputFieldValue) {
    methods.changeTodo(position, inputFieldValue);
    view.displayTodos();
  },

  deleteTodo: function(position) {
    methods.deleteTodo(position);
    view.displayTodos();
  },

  toggleCompleted: function(position) {
    methods.toggleCompleted(position);
    view.displayTodos();
  },

  toggleAll: function() {
    methods.toggleAll();
    view.displayTodos();
  },

  addTodo: function() {
    var addTodoTextInput = document.getElementById('addTodoInput')
    methods.addTodo(addTodoTextInput.value);
    addTodoTextInput.value = '';
    view.displayTodos();
  },

  nestTodo: function(position, inputFieldValue) {
    methods.nestTodo(position, inputFieldValue);
    view.displayTodos();
  }
}

var view = {
  displayTodos: function() {
    if (todoList.todos.length === 0) {
      console.log('nothing to do');
    }
    var todosUl = document.querySelector('ul')
    todosUl.innerHTML = ''
    todoList.todos.forEach(function(element) {
      var todoLi = document.createElement('li');
      todoLi.id = todoList.todos.indexOf(element);
      if (element.completed === true) {
        todoLi.textContent = '(x) ' + element.todoText;
      } else {
        todoLi.textContent = '( ) ' + element.todoText;
      };
      todoLi.appendChild(view.createDeleteButton());
      todoLi.appendChild(view.createToggleButton());
      todoLi.appendChild(view.changeTodoInputField());
      todosUl.appendChild(todoLi);
    });
  },

  createDeleteButton: function() {
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'deleteButton';
    return deleteButton;
  },

  createToggleButton: function() {
    var toggleButton = document.createElement('button');
    toggleButton.textContent = 'Toggle';
    toggleButton.className = 'toggleButton';
    return toggleButton;
  },

  changeTodoInputField: function() {
    var todoInputField = document.createElement('input');
    todoInputField.type = 'text';
    todoInputField.className = 'todoInput';
    return todoInputField; 
  },

  eventListeners: function() {
    var todosUl = document.querySelector('ul');
    todosUl.addEventListener('click', function(event) {
      if (event.target.className === 'deleteButton') {
        var position = parseInt(event.target.parentNode.id)
        handlers.deleteTodo(position);
      }
      if (event.target.className === 'toggleButton') {
        var position = parseInt(event.target.parentNode.id)
        handlers.toggleCompleted(position);
      }
    });
    todosUl.addEventListener('keyup', function(event) {
      if (event.target.className === 'todoInput' && event.keyCode === 13) {
        var position = parseInt(event.target.parentNode.id);
        var inputFieldValue = event.srcElement.value;
        handlers.changeTodo(position, inputFieldValue); 
      }
    });
    todosUl.addEventListener('keyup', function(event) {
      if (event.target.className === 'todoInput' && event.keyCode === 40) {
        var position = parseInt(event. target.parentNode.id);
        var inputFieldValue = event.srcElement.value;
        handlers.nestTodo(position, inputFieldValue);
      }
    })
  }
}

view.eventListeners();
