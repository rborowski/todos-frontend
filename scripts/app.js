const TodosApp = {
  data() {
    return {
      isLoading: false,
      todos: [],
      enteredTodoText: "",
      editedTodoId: null,
    };
  },
  methods: {
    async saveTodo(event) {
      event.preventDefault();
      if (!this.editedTodoId) {
        let response;

        try {
          response = await fetch("http://localhost:3000/todos", {
            method: "POST",
            body: JSON.stringify({
              text: this.enteredTodoText,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          alert("Something went wrong!");
          return;
        }

        if (!response.ok) {
          alert("Something went wrong!");
          return;
        }

        const responseData = await response.json();

        const newTodo = {
          text: this.enteredTodoText,
          id: responseData.createdTodo.id,
        };
        this.todos.push(newTodo);
      } else {
        let response;
        const todoId = this.editedTodoId;
        try {
          response = await fetch(
            "http://localhost:3000/todos/" + todoId,
            {
              method: "PATCH",
              body: JSON.stringify({
                newText: this.enteredTodoText,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        } catch (error) {
          alert("Something went wrong!");
          return;
        }

        if (!response.ok) {
          alert("Something went wrong!");
          return;
        }
        
        const todo = this.todos.find((todoItem) => todoItem.id === todoId);
        todo.text = this.enteredTodoText;
        this.editedTodoId = null;
      }
      this.enteredTodoText = "";
    },



    startEditTodo(todoId) {
      this.editedTodoId = todoId;
      const todo = this.todos.find((todoItem) => todoItem.id === todoId);
      this.enteredTodoText = todo.text;
    },

    async deleteTodo(todoId) {

      let response;

      try {
        response = await fetch('http://localhost:3000/todos/' + todoId, {
          method: 'DELETE',
        });
      } catch (error) {
        alert('Something went wrong!');
        return;
      }
    
      if (!response.ok) {
        alert('Something went wrong!');
        return;
      }

      this.todos = this.todos.filter((todoItem) => todoItem.id !== todoId);
    },
  },
  async created() {
      let response;
      this.isLoading = true

      try {
        response = await fetch('http://localhost:3000/todos');
      } catch (error) {
        alert('Something went wrong!');
        this.isLoading = false
        return;
      }
    
      this.isLoading = false

      if (!response.ok) {
        alert('Something went wrong!');
        return;
      }
    
      const responseData = await response.json();
      this.todos = responseData.todos;
    },
};

Vue.createApp(TodosApp).mount("#todos-app");
