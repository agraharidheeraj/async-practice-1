const fetch = require('node-fetch');

// Function to fetch user data from the API
async function fetchUserData() {
  const response = await fetch('http://localhost:3000/users');
  const userData = await response.json();
  return userData;
}

// Function to fetch data for the first five users and calculate the number of completed todos for each user
async function calculateCompletedTodosForFirstFiveUsers() {
  const { users } = await fetchUserData();
  const chunkSize = 5;
  const result = [];

  for (let i = 0; i < users.length; i += chunkSize) {
    const chunk = users.slice(i, i + chunkSize);

    const todoPromises = chunk.map(async (user) => {
      const todosResponse = await fetch(`http://localhost:3000/todos?user_id=${user.id}`);
      const todosData = await todosResponse.json();

      return { user, todos: todosData.todos };
    });

    const userTodos = await Promise.all(todoPromises);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    for (const { user, todos } of userTodos) {
      let completedTodoCount = 0;

      todos.forEach((todo) => {
        if (todo.isCompleted === true) {
          completedTodoCount++;
        }
      });

      result.push({
        id: user.id,
        name: user.name,
        numTodosCompleted: completedTodoCount,
      });
    }

    console.log('Calculating how many todos are completed for each user:');
    console.log(result);
  }
}

// Start the process to calculate completed todos for the first five users
calculateCompletedTodosForFirstFiveUsers();
