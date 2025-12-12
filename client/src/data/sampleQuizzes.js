export const sampleQuizzes = [
    {
        name: "Science: Space Exploration",
        description: "Journey through the cosmos with these questions about our universe.",
        questionType: "Quiz",
        pointType: "Standard",
        answerTime: 10,
        gameMode: "Standard",
        backgroundImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000",
        questionList: [
            {
                questionIndex: 1,
                question: "Which planet is known as the Red Planet?",
                answerList: [
                    { name: "option1", body: "Venus", isCorrect: false },
                    { name: "option2", body: "Mars", isCorrect: true },
                    { name: "option3", body: "Jupiter", isCorrect: false },
                    { name: "option4", body: "Saturn", isCorrect: false }
                ]
            },
            {
                questionIndex: 2,
                question: "Who was the first human to travel into space?",
                answerList: [
                    { name: "option1", body: "Neil Armstrong", isCorrect: false },
                    { name: "option2", body: "Yuri Gagarin", isCorrect: true },
                    { name: "option3", body: "Buzz Aldrin", isCorrect: false },
                    { name: "option4", body: "John Glenn", isCorrect: false }
                ]
            },
            {
                questionIndex: 3,
                question: "What galaxy is Earth located in?",
                answerList: [
                    { name: "option1", body: "Andromeda", isCorrect: false },
                    { name: "option2", body: "Milky Way", isCorrect: true },
                    { name: "option3", body: "Triangulum", isCorrect: false },
                    { name: "option4", body: "Whirlpool", isCorrect: false }
                ]
            }
        ]
    },
    {
        name: "Tech Trivia 101",
        description: "Test your knowledge of computers, programming, and tech history.",
        questionType: "Quiz",
        pointType: "Double",
        answerTime: 15,
        gameMode: "RapidFire",
        backgroundImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000",
        questionList: [
            {
                questionIndex: 1,
                question: "What does CPU stand for?",
                answerList: [
                    { name: "option1", body: "Central Process Unit", isCorrect: false },
                    { name: "option2", body: "Central Processing Unit", isCorrect: true },
                    { name: "option3", body: "Computer Personal Unit", isCorrect: false },
                    { name: "option4", body: "Central Processor Unit", isCorrect: false }
                ]
            },
            {
                questionIndex: 2,
                question: "Which company created the iPhone?",
                answerList: [
                    { name: "option1", body: "Samsung", isCorrect: false },
                    { name: "option2", body: "Apple", isCorrect: true },
                    { name: "option3", body: "Microsoft", isCorrect: false },
                    { name: "option4", body: "Google", isCorrect: false }
                ]
            }
        ]
    },
    {
        name: "World Capitals",
        description: "How well do you know the capitals of the world?",
        questionType: "Quiz",
        pointType: "Standard",
        answerTime: 10,
        gameMode: "Standard",
        backgroundImage: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1000",
        questionList: [
            {
                questionIndex: 1,
                question: "What is the capital of France?",
                answerList: [
                    { name: "option1", body: "London", isCorrect: false },
                    { name: "option2", body: "Paris", isCorrect: true },
                    { name: "option3", body: "Berlin", isCorrect: false },
                    { name: "option4", body: "Madrid", isCorrect: false }
                ]
            },
            {
                questionIndex: 2,
                question: "What is the capital of Japan?",
                answerList: [
                    { name: "option1", body: "Beijing", isCorrect: false },
                    { name: "option2", body: "Tokyo", isCorrect: true },
                    { name: "option3", body: "Seoul", isCorrect: false },
                    { name: "option4", body: "Bangkok", isCorrect: false }
                ]
            },
            {
                questionIndex: 3,
                question: "What is the capital of Australia?",
                answerList: [
                    { name: "option1", body: "Sydney", isCorrect: false },
                    { name: "option2", body: "Canberra", isCorrect: true },
                    { name: "option3", body: "Melbourne", isCorrect: false },
                    { name: "option4", body: "Perth", isCorrect: false }
                ]
            }
        ]
    },
    {
        name: "Movie Buff Challenge",
        description: "Guess the movie, actor, or famous quote!",
        questionType: "Quiz",
        pointType: "Standard",
        answerTime: 12,
        gameMode: "Standard",
        backgroundImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=1000",
        questionList: [
            {
                questionIndex: 1,
                question: "Who played Iron Man in the MCU?",
                answerList: [
                    { name: "option1", body: "Chris Evans", isCorrect: false },
                    { name: "option2", body: "Robert Downey Jr.", isCorrect: true },
                    { name: "option3", body: "Chris Hemsworth", isCorrect: false },
                    { name: "option4", body: "Mark Ruffalo", isCorrect: false }
                ]
            },
            {
                questionIndex: 2,
                question: "Which movie features the quote 'May the Force be with you'?",
                answerList: [
                    { name: "option1", body: "Star Trek", isCorrect: false },
                    { name: "option2", body: "Star Wars", isCorrect: true },
                    { name: "option3", body: "Galaxy Quest", isCorrect: false },
                    { name: "option4", body: "Guardians of the Galaxy", isCorrect: false }
                ]
            }
        ]
    },
    {
        name: "History: Ancient Civilizations",
        description: "Travel back in time to ancient Egypt, Rome, and Greece.",
        questionType: "Quiz",
        pointType: "Standard",
        answerTime: 15,
        gameMode: "Standard",
        backgroundImage: "https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?auto=format&fit=crop&q=80&w=1000",
        questionList: [
            {
                questionIndex: 1,
                question: "Which civilization built the pyramids?",
                answerList: [
                    { name: "option1", body: "Romans", isCorrect: false },
                    { name: "option2", body: "Egyptians", isCorrect: true },
                    { name: "option3", body: "Greeks", isCorrect: false },
                    { name: "option4", body: "Mayans", isCorrect: false }
                ]
            },
            {
                questionIndex: 2,
                question: "Who was the first emperor of Rome?",
                answerList: [
                    { name: "option1", body: "Julius Caesar", isCorrect: false },
                    { name: "option2", body: "Augustus", isCorrect: true },
                    { name: "option3", body: "Nero", isCorrect: false },
                    { name: "option4", body: "Constantine", isCorrect: false }
                ]
            }
        ]
    },
    {
        name: "Coding Basics: JavaScript",
        description: "Variables, functions, and loops! Oh my!",
        questionType: "Quiz",
        pointType: "Standard",
        answerTime: 20,
        gameMode: "Standard",
        backgroundImage: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&q=80&w=1000",
        questionList: [
            {
                questionIndex: 1,
                question: "Which symbol is used for comments in JavaScript?",
                answerList: [
                    { name: "option1", body: "//", isCorrect: true },
                    { name: "option2", body: "#", isCorrect: false },
                    { name: "option3", body: "<!-- -->", isCorrect: false },
                    { name: "option4", body: "**", isCorrect: false }
                ]
            },
            {
                questionIndex: 2,
                question: "How do you declare a variable in ES6?",
                answerList: [
                    { name: "option1", body: "var", isCorrect: false },
                    { name: "option2", body: "let / const", isCorrect: true },
                    { name: "option3", body: "int", isCorrect: false },
                    { name: "option4", body: "string", isCorrect: false }
                ]
            }
        ]
    },
    {
        name: "Animal Kingdom",
        description: "Wild facts about our furry, scaly, and feathered friends.",
        questionType: "Quiz",
        pointType: "Standard",
        answerTime: 10,
        gameMode: "Standard",
        backgroundImage: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&q=80&w=1000",
        questionList: [
            {
                questionIndex: 1,
                question: "Which is the largest land animal?",
                answerList: [
                    { name: "option1", body: "Rhino", isCorrect: false },
                    { name: "option2", body: "African Elephant", isCorrect: true },
                    { name: "option3", body: "Giraffe", isCorrect: false },
                    { name: "option4", body: "Hippo", isCorrect: false }
                ]
            },
            {
                questionIndex: 2,
                question: "What is the fastest land animal?",
                answerList: [
                    { name: "option1", body: "Lion", isCorrect: false },
                    { name: "option2", body: "Cheetah", isCorrect: true },
                    { name: "option3", body: "Leopard", isCorrect: false },
                    { name: "option4", body: "Gazelle", isCorrect: false }
                ]
            }
        ]
    },
    {
        name: "Music Legends",
        description: "From Rock n' Roll to Pop Icons.",
        questionType: "Quiz",
        pointType: "Standard",
        answerTime: 10,
        gameMode: "Standard",
        backgroundImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1000",
        questionList: [
            {
                questionIndex: 1,
                question: "Who is known as the King of Pop?",
                answerList: [
                    { name: "option1", body: "Elvis Presley", isCorrect: false },
                    { name: "option2", body: "Michael Jackson", isCorrect: true },
                    { name: "option3", body: "Prince", isCorrect: false },
                    { name: "option4", body: "Freddie Mercury", isCorrect: false }
                ]
            },
            {
                questionIndex: 2,
                question: "Which band sang 'Bohemian Rhapsody'?",
                answerList: [
                    { name: "option1", body: "The Beatles", isCorrect: false },
                    { name: "option2", body: "Queen", isCorrect: true },
                    { name: "option3", body: "Pink Floyd", isCorrect: false },
                    { name: "option4", body: "Led Zeppelin", isCorrect: false }
                ]
            }
        ]
    },
    {
        name: "Sports Trivia",
        description: "Touchdowns, goals, and home runs!",
        questionType: "Quiz",
        pointType: "Standard",
        answerTime: 10,
        gameMode: "Standard",
        backgroundImage: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=1000",
        questionList: [
            {
                questionIndex: 1,
                question: "In which sport would you perform a slam dunk?",
                answerList: [
                    { name: "option1", body: "Soccer", isCorrect: false },
                    { name: "option2", body: "Basketball", isCorrect: true },
                    { name: "option3", body: "Tennis", isCorrect: false },
                    { name: "option4", body: "Golf", isCorrect: false }
                ]
            },
            {
                questionIndex: 2,
                question: "How long is a marathon?",
                answerList: [
                    { name: "option1", body: "10 miles", isCorrect: false },
                    { name: "option2", body: "26.2 miles", isCorrect: true },
                    { name: "option3", body: "13.1 miles", isCorrect: false },
                    { name: "option4", body: "50 miles", isCorrect: false }
                ]
            }
        ]
    },
    {
        name: "Geography Whiz",
        description: "Identify countries, flags, and landmarks.",
        questionType: "Quiz",
        pointType: "Standard",
        answerTime: 12,
        gameMode: "Standard",
        backgroundImage: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000",
        questionList: [
            {
                questionIndex: 1,
                question: "Which country has the largest population?",
                answerList: [
                    { name: "option1", body: "USA", isCorrect: false },
                    { name: "option2", body: "India", isCorrect: true }, // As of recent updates
                    { name: "option3", body: "Russia", isCorrect: false },
                    { name: "option4", body: "Brazil", isCorrect: false }
                ]
            },
            {
                questionIndex: 2,
                question: "The Eiffel Tower is located in which city?",
                answerList: [
                    { name: "option1", body: "Rome", isCorrect: false },
                    { name: "option2", body: "Paris", isCorrect: true },
                    { name: "option3", body: "London", isCorrect: false },
                    { name: "option4", body: "Berlin", isCorrect: false }
                ]
            }
        ]
    },
    {
        name: "Literature Classics",
        description: "Books that changed the world.",
        questionType: "Quiz",
        pointType: "Standard",
        answerTime: 15,
        gameMode: "Standard",
        backgroundImage: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&q=80&w=1000",
        questionList: [
            {
                questionIndex: 1,
                question: "Who wrote 'Romeo and Juliet'?",
                answerList: [
                    { name: "option1", body: "Jane Austen", isCorrect: false },
                    { name: "option2", body: "William Shakespeare", isCorrect: true },
                    { name: "option3", body: "Charles Dickens", isCorrect: false },
                    { name: "option4", body: "Mark Twain", isCorrect: false }
                ]
            },
            {
                questionIndex: 2,
                question: "Which series features a wizard named Harry?",
                answerList: [
                    { name: "option1", body: "Lord of the Rings", isCorrect: false },
                    { name: "option2", body: "Harry Potter", isCorrect: true },
                    { name: "option3", body: "Percy Jackson", isCorrect: false },
                    { name: "option4", body: "Twilight", isCorrect: false }
                ]
            }
        ]
    },
    {
        name: "General Knowledge Mixed",
        description: "A little bit of everything!",
        questionType: "Quiz",
        pointType: "Standard",
        answerTime: 10,
        gameMode: "Standard",
        backgroundImage: "https://images.unsplash.com/photo-1533227297464-968593cc1194?auto=format&fit=crop&q=80&w=1000",
        questionList: [
            {
                questionIndex: 1,
                question: "What is 5 x 5?",
                answerList: [
                    { name: "option1", body: "20", isCorrect: false },
                    { name: "option2", body: "25", isCorrect: true },
                    { name: "option3", body: "30", isCorrect: false },
                    { name: "option4", body: "10", isCorrect: false }
                ]
            },
            {
                questionIndex: 2,
                question: "What color is a banana?",
                answerList: [
                    { name: "option1", body: "Red", isCorrect: false },
                    { name: "option2", body: "Yellow", isCorrect: true },
                    { name: "option3", body: "Blue", isCorrect: false },
                    { name: "option4", body: "Purple", isCorrect: false }
                ]
            }
        ]
    }
];
