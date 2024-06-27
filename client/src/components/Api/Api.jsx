const API_BASE_URL = "http://localhost:5000/api";


// Helper function to handle responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }
  const responseData= await response.json();
  console.log(responseData);
  return responseData;
};

// API requests using Fetch
export const fetchUsers = () =>
  fetch(`${API_BASE_URL}/users`, { headers: getAuthHeader() }).then(handleResponse);

export const createUser =async (newUser) =>
  {
    try{
      const data=  await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(newUser),
      });
     return await data.json()
    }catch(err){
      console.log(err)
      return null;
    }

}


export const updateQuiz = async (id, updatedQuiz) => {
  try {
    console.log(`Sending update request for quiz with id: ${id}`);
    console.log('Updated quiz data:', updatedQuiz);

    const response = await fetch(`${API_BASE_URL}/quizes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedQuiz),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to update quiz. Error response:', error);
      throw new Error(error.message || "Failed to update quiz");
    }

    const data = await response.json();
    console.log('Successfully updated quiz:', data);
    return data;
  } catch (err) {
    console.error("Error updating quiz:", err);
    return null;
  }
};


export const fetchTeacherQuizes = async (teacherId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/quizes/teacher/${teacherId}`, { 
      method: "GET",
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching teacher quizzes:', error);
    return null;
  }
};

export const fetchQuiz = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/quizes/${id}`, {
      method: "GET",
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch quiz data');
    }
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching quiz data:', error);
    return null;
  }
};


export const getUser=async(id)=>{
  try{
    const data=  await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(user),
    });
   return await data.json()
  }catch(err){
    console.log(err)
    return null;
  }
}

export const updateUser = (id, updatedUser) =>
  fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(updatedUser),
  }).then(handleResponse);

export const deleteUser = (id) =>
  fetch(`${API_BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  }).then(handleResponse);

  export const createQuiz = async (newQuiz) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quizes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuiz),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create quiz");
      }
  
      return await response.json();
    } catch (err) {
      console.log("Error creating quiz:", err);
      return null;
    }
  };


  //Update quizyy
  
  // export const updateQuiz = (id, updatedQuiz) =>
  // fetch(`${API_BASE_URL}/quizes/${id}`, {
  //   method: "PATCH",
  //   headers: { "Content-Type": "application/json", ...getAuthHeader() },
  //   body: JSON.stringify(updatedQuiz),
  // }).then(handleResponse);
  
  
  

  export const fetchQuizes = async (quizData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quizes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(quizData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save quiz data');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error saving quiz data:', error);
      return null;
    }
  }
  // fetch(`${API_BASE_URL}/`, { headers: getAuthHeader() }).then(handleResponse);

export const fetchPublicQuizes = (page) =>

  fetch(`${API_BASE_URL}/quizes/public?page=${page}`, { headers: getAuthHeader() }).then(handleResponse);

export const fetchQuizesBySearch = (searchQuery) =>
  fetch(`${API_BASE_URL}/quizes/search?searchQuery=${searchQuery.search || "none"}&tags=${searchQuery.tags}`, { headers: getAuthHeader() }).then(handleResponse);

 

export const fetchQuestions = (quizId) =>
  fetch(`${API_BASE_URL}/quizes/${quizId}`, { headers: getAuthHeader() }).then(handleResponse);

export const createQuestion = (quizId, newQuestion) =>
  fetch(`${API_BASE_URL}/quizes/${quizId}/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(newQuestion),
  }).then(handleResponse);

export const updateQuestion = (quizId, questionId, updatedQuestion) =>
  fetch(`${API_BASE_URL}/quizes/${quizId}/questions/${questionId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(updatedQuestion),
  }).then(handleResponse);



export const deleteQuiz = (id) =>
  fetch(`${API_BASE_URL}/quizes/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  }).then(handleResponse);



export const createGame = (newGame) =>
  fetch(`${API_BASE_URL}/games`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(newGame),
  }).then(handleResponse);

export const fetchGame = (id) =>
  fetch(`${API_BASE_URL}/games/${id}`, { headers: getAuthHeader() }).then(handleResponse);

export const addPlayer = (gameId, playerId) =>
  fetch(`${API_BASE_URL}/games/${gameId}/players`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify({ playerId }),
  }).then(handleResponse);

export const createPlayerResult = (newPlayerResult) =>
  fetch(`${API_BASE_URL}/playerResults`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(newPlayerResult),
  }).then(handleResponse);

export const fetchPlayerResult = (id) =>
  fetch(`${API_BASE_URL}/playerResults/${id}`, { headers: getAuthHeader() }).then(handleResponse);

export const addAnswer = (newAnswer, id) =>
  fetch(`${API_BASE_URL}/playerResults/${id}/answers`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify({ newAnswer }),
  }).then(handleResponse);

export const createLeaderboard = (newLeaderboard) =>
  fetch(`${API_BASE_URL}/leaderboard`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(newLeaderboard),
  }).then(handleResponse);

export const fetchLeaderboard = (id) =>
  fetch(`${API_BASE_URL}/leaderboard/${id}`, { headers: getAuthHeader() }).then(handleResponse);

export const addPlayerResult = (playerResult, id) =>
  fetch(`${API_BASE_URL}/leaderboard/${id}/playerresult`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(playerResult),
  }).then(handleResponse);

export const updateQuestionLeaderboard = (questionResult, id) =>
  fetch(`${API_BASE_URL}/leaderboard/${id}/questionleaderboard`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(questionResult),
  }).then(handleResponse);

export const updateCurrentLeaderboard = (result, id) =>
  fetch(`${API_BASE_URL}/leaderboard/${id}/currentleaderboard`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(result),
  }).then(handleResponse);
