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
- it should create a "subtask" array on the given item that has the same 
*/


var todoList = {
  todos: []
}

var methods = {

  addTodo: function(newTodo) {
    todoList.todos.push({
      todoText: newTodo, 
      completed: false,
      subtask: []
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

  // nestTodo: function(positionMap, subTodo) {
  //   // if nestTodo is run on a second level subtask, does anything need to change?
  //     // get its id and mark that as it's position
  //     // check if it has a parent
  //     // yes => go get that parent's id
  //     // no => you have the lowest level id
  //   // needs to be able to handle n number of positions and enter in the right area
  //   // positionMap is an array that tells you where the subTodo is being entered
  //   // 
  //   todoList.todos[position].subtask.push({
  //       todoText: subTodo,
  //       completed: false,
  //       subtask: []
  //     })
  // }
  nestTodo: function(positionMap, subTodo) {
    function finder (positionMap) {
      var suffix = ''
      for (var i = 1; i < positionMap.length; i++) {
      suffix = suffix+'.'+'subtask[' + positionMap[i] + ']';
      };
      var prefix = 'todoList.todos['+positionMap[0]+']';
      return eval(prefix+suffix+'.subtask');   
    };
    if (positionMap.length > 1) {
      finder(positionMap).push({
        todoText: subTodo,
        completed: false,
        subtask: []
      })   
    } else {
      todoList.todos[positionMap[0]].subtask.push({
        todoText: subTodo,
        completed: false,
        subtask: []
      })
    }
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

  nestTodo: function(positionMap, inputFieldValue) {
    methods.nestTodo(positionMap, inputFieldValue);
    view.displayTodos();
  }
}

var view = {
  // create an if statement that handles the base case 
  // 
  displayTodos: function() {
    if (todoList.todos.length === 0) {
      console.log('nothing to do');
    }
    var todosUl = document.querySelector('ul')
    todosUl.id = "headOfTheHouse"
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
        // var inputFieldValue = event.srcElement.value;
        // var position = parseInt(event. target.parentNode.id);
        // handlers.nestTodo(position, inputFieldValue);
        var inputFieldValue = event.srcElement.value;
        var positionMap = [];
        var eventPlaceholder = event.target
        function positionMapper(eventPlaceholder){
          if (eventPlaceholder.parentNode.id === 'headOfTheHouse') {           
            return positionMap;
          } else {
            var position = parseInt(eventPlaceholder.parentNode.id);
            positionMap.unshift(position);
            //move up one level
            eventPlaceholder = eventPlaceholder.parentNode;
            return positionMapper(eventPlaceholder);
          }
        }
        positionMapper(eventPlaceholder);
        handlers.nestTodo(positionMap, inputFieldValue);
      }
    })
  }
}

view.eventListeners();
