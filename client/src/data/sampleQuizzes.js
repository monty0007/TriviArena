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
            },
            {
                questionIndex: 4,
                question: "Which planet has the most moons?",
                answerList: [
                    { name: "option1", body: "Mars", isCorrect: false },
                    { name: "option2", body: "Saturn", isCorrect: true },
                    { name: "option3", body: "Jupiter", isCorrect: false },
                    { name: "option4", body: "Uranus", isCorrect: false }
                ]
            },
            {
                questionIndex: 5,
                question: "What is the hottest planet in our solar system?",
                answerList: [
                    { name: "option1", body: "Mercury", isCorrect: false },
                    { name: "option2", body: "Venus", isCorrect: true },
                    { name: "option3", body: "Mars", isCorrect: false },
                    { name: "option4", body: "Jupiter", isCorrect: false }
                ]
            },
            {
                questionIndex: 6,
                question: "Which celestial body is at the center of our solar system?",
                answerList: [
                    { name: "option1", body: "Earth", isCorrect: false },
                    { name: "option2", body: "The Sun", isCorrect: true },
                    { name: "option3", body: "The Moon", isCorrect: false },
                    { name: "option4", body: "Jupiter", isCorrect: false }
                ]
            },
            {
                questionIndex: 7,
                question: "What is the name of the NASA rover that landed on Mars in 2021?",
                answerList: [
                    { name: "option1", body: "Curiosity", isCorrect: false },
                    { name: "option2", body: "Perseverance", isCorrect: true },
                    { name: "option3", body: "Spirit", isCorrect: false },
                    { name: "option4", body: "Opportunity", isCorrect: false }
                ]
            },
            {
                questionIndex: 8,
                question: "Which planet is famous for its beautiful rings?",
                answerList: [
                    { name: "option1", body: "Neptune", isCorrect: false },
                    { name: "option2", body: "Saturn", isCorrect: true },
                    { name: "option3", body: "Jupiter", isCorrect: false },
                    { name: "option4", body: "Mars", isCorrect: false }
                ]
            },
            {
                questionIndex: 9,
                question: "How long does it take for light from the Sun to reach Earth?",
                answerList: [
                    { name: "option1", body: "8 seconds", isCorrect: false },
                    { name: "option2", body: "8 minutes", isCorrect: true },
                    { name: "option3", body: "8 hours", isCorrect: false },
                    { name: "option4", body: "8 days", isCorrect: false }
                ]
            },
            {
                questionIndex: 10,
                question: "What is the term for a star that explodes?",
                answerList: [
                    { name: "option1", body: "Nebula", isCorrect: false },
                    { name: "option2", body: "Supernova", isCorrect: true },
                    { name: "option3", body: "Black Hole", isCorrect: false },
                    { name: "option4", body: "Red Giant", isCorrect: false }
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
            },
            {
                questionIndex: 3,
                question: "What is the main function of RAM in a computer?",
                answerList: [
                    { name: "option1", body: "Long-term storage", isCorrect: false },
                    { name: "option2", body: "Short-term memory", isCorrect: true },
                    { name: "option3", body: "Graphic processing", isCorrect: false },
                    { name: "option4", body: "Cooling system", isCorrect: false }
                ]
            },
            {
                questionIndex: 4,
                question: "Who is the co-founder of Microsoft?",
                answerList: [
                    { name: "option1", body: "Steve Jobs", isCorrect: false },
                    { name: "option2", body: "Bill Gates", isCorrect: true },
                    { name: "option3", body: "Mark Zuckerberg", isCorrect: false },
                    { name: "option4", body: "Jeff Bezos", isCorrect: false }
                ]
            },
            {
                questionIndex: 5,
                question: "What does HTML stand for?",
                answerList: [
                    { name: "option1", body: "HyperText Markup Language", isCorrect: true },
                    { name: "option2", body: "HighText Machine Language", isCorrect: false },
                    { name: "option3", body: "HyperText Machine Language", isCorrect: false },
                    { name: "option4", body: "HighText Markup Language", isCorrect: false }
                ]
            },
            {
                questionIndex: 6,
                question: "Which programming language is known as the 'language of the web'?",
                answerList: [
                    { name: "option1", body: "Python", isCorrect: false },
                    { name: "option2", body: "JavaScript", isCorrect: true },
                    { name: "option3", body: "C++", isCorrect: false },
                    { name: "option4", body: "Java", isCorrect: false }
                ]
            },
            {
                questionIndex: 7,
                question: "What year was the first iPhone released?",
                answerList: [
                    { name: "option1", body: "2005", isCorrect: false },
                    { name: "option2", body: "2007", isCorrect: true },
                    { name: "option3", body: "2009", isCorrect: false },
                    { name: "option4", body: "2010", isCorrect: false }
                ]
            },
            {
                questionIndex: 8,
                question: "Which of these is an Operating System?",
                answerList: [
                    { name: "option1", body: "Google Chrome", isCorrect: false },
                    { name: "option2", body: "Linux", isCorrect: true },
                    { name: "option3", body: "Intel", isCorrect: false },
                    { name: "option4", body: "Dell", isCorrect: false }
                ]
            },
            {
                questionIndex: 9,
                question: "What does 'SaaS' stand for?",
                answerList: [
                    { name: "option1", body: "System as a Service", isCorrect: false },
                    { name: "option2", body: "Software as a Service", isCorrect: true },
                    { name: "option3", body: "Server as a Service", isCorrect: false },
                    { name: "option4", body: "Software as a System", isCorrect: false }
                ]
            },
            {
                questionIndex: 10,
                question: "Who is the CEO of Tesla (2024)?",
                answerList: [
                    { name: "option1", body: "Tim Cook", isCorrect: false },
                    { name: "option2", body: "Elon Musk", isCorrect: true },
                    { name: "option3", body: "Sundar Pichai", isCorrect: false },
                    { name: "option4", body: "Satya Nadella", isCorrect: false }
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
            },
            {
                questionIndex: 4,
                question: "What is the capital of Canada?",
                answerList: [
                    { name: "option1", body: "Toronto", isCorrect: false },
                    { name: "option2", body: "Ottawa", isCorrect: true },
                    { name: "option3", body: "Vancouver", isCorrect: false },
                    { name: "option4", body: "Montreal", isCorrect: false }
                ]
            },
            {
                questionIndex: 5,
                question: "What is the capital of Brazil?",
                answerList: [
                    { name: "option1", body: "Rio de Janeiro", isCorrect: false },
                    { name: "option2", body: "Brasilia", isCorrect: true },
                    { name: "option3", body: "Sao Paulo", isCorrect: false },
                    { name: "option4", body: "Salvador", isCorrect: false }
                ]
            },
            {
                questionIndex: 6,
                question: "Which city is the capital of Egypt?",
                answerList: [
                    { name: "option1", body: "Alexandria", isCorrect: false },
                    { name: "option2", body: "Cairo", isCorrect: true },
                    { name: "option3", body: "Giza", isCorrect: false },
                    { name: "option4", body: "Luxor", isCorrect: false }
                ]
            },
            {
                questionIndex: 7,
                question: "What is the capital of Germany?",
                answerList: [
                    { name: "option1", body: "Munich", isCorrect: false },
                    { name: "option2", body: "Berlin", isCorrect: true },
                    { name: "option3", body: "Frankfurt", isCorrect: false },
                    { name: "option4", body: "Hamburg", isCorrect: false }
                ]
            },
            {
                questionIndex: 8,
                question: "What is the capital of Argentina?",
                answerList: [
                    { name: "option1", body: "Buenos Aires", isCorrect: true },
                    { name: "option2", body: "Santiago", isCorrect: false },
                    { name: "option3", body: "Lima", isCorrect: false },
                    { name: "option4", body: "Bogota", isCorrect: false }
                ]
            },
            {
                questionIndex: 9,
                question: "What is the capital of Thailand?",
                answerList: [
                    { name: "option1", body: "Phuket", isCorrect: false },
                    { name: "option2", body: "Bangkok", isCorrect: true },
                    { name: "option3", body: "Chiang Mai", isCorrect: false },
                    { name: "option4", body: "Pattaya", isCorrect: false }
                ]
            },
            {
                questionIndex: 10,
                question: "What is the capital of Italy?",
                answerList: [
                    { name: "option1", body: "Milan", isCorrect: false },
                    { name: "option2", body: "Rome", isCorrect: true },
                    { name: "option3", body: "Venice", isCorrect: false },
                    { name: "option4", body: "Florence", isCorrect: false }
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
            },
            {
                questionIndex: 3,
                question: "Which movie won the Oscar for Best Picture in 1994?",
                answerList: [
                    { name: "option1", body: "Pulp Fiction", isCorrect: false },
                    { name: "option2", body: "Forrest Gump", isCorrect: true },
                    { name: "option3", body: "The Shawshank Redemption", isCorrect: false },
                    { name: "option4", body: "Speed", isCorrect: false }
                ]
            },
            {
                questionIndex: 4,
                question: "Who directed the movie 'Titanic'?",
                answerList: [
                    { name: "option1", body: "Steven Spielberg", isCorrect: false },
                    { name: "option2", body: "James Cameron", isCorrect: true },
                    { name: "option3", body: "Christopher Nolan", isCorrect: false },
                    { name: "option4", body: "Martin Scorsese", isCorrect: false }
                ]
            },
            {
                questionIndex: 5,
                question: "What is the name of the hobbit played by Elijah Wood in 'The Lord of the Rings'?",
                answerList: [
                    { name: "option1", body: "Samwise Gamgee", isCorrect: false },
                    { name: "option2", body: "Frodo Baggins", isCorrect: true },
                    { name: "option3", body: "Bilbo Baggins", isCorrect: false },
                    { name: "option4", body: "Peregrin Took", isCorrect: false }
                ]
            },
            {
                questionIndex: 6,
                question: "Which animated movie features a character named Simba?",
                answerList: [
                    { name: "option1", body: "Aladdin", isCorrect: false },
                    { name: "option2", body: "The Lion King", isCorrect: true },
                    { name: "option3", body: "Finding Nemo", isCorrect: false },
                    { name: "option4", body: "Tarzan", isCorrect: false }
                ]
            },
            {
                questionIndex: 7,
                question: "Who played the Joker in 'The Dark Knight'?",
                answerList: [
                    { name: "option1", body: "Jack Nicholson", isCorrect: false },
                    { name: "option2", body: "Heath Ledger", isCorrect: true },
                    { name: "option3", body: "Jared Leto", isCorrect: false },
                    { name: "option4", body: "Joaquin Phoenix", isCorrect: false }
                ]
            },
            {
                questionIndex: 8,
                question: "What is the highest-grossing movie of all time (as of 2023)?",
                answerList: [
                    { name: "option1", body: "Avengers: Endgame", isCorrect: false },
                    { name: "option2", body: "Avatar", isCorrect: true },
                    { name: "option3", body: "Titanic", isCorrect: false },
                    { name: "option4", body: "Star Wars: The Force Awakens", isCorrect: false }
                ]
            },
            {
                questionIndex: 9,
                question: "In The Matrix, does Neo take the blue pill or the red pill?",
                answerList: [
                    { name: "option1", body: "Blue", isCorrect: false },
                    { name: "option2", body: "Red", isCorrect: true },
                    { name: "option3", body: "Green", isCorrect: false },
                    { name: "option4", body: "Yellow", isCorrect: false }
                ]
            },
            {
                questionIndex: 10,
                question: "What is the name of the toy cowboy in 'Toy Story'?",
                answerList: [
                    { name: "option1", body: "Buzz", isCorrect: false },
                    { name: "option2", body: "Woody", isCorrect: true },
                    { name: "option3", body: "Jessie", isCorrect: false },
                    { name: "option4", body: "Bullseye", isCorrect: false }
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
            },
            {
                questionIndex: 3,
                question: "Which ancient civilization invented paper?",
                answerList: [
                    { name: "option1", body: "India", isCorrect: false },
                    { name: "option2", body: "China", isCorrect: true },
                    { name: "option3", body: "Egypt", isCorrect: false },
                    { name: "option4", body: "Mesopotamia", isCorrect: false }
                ]
            },
            {
                questionIndex: 4,
                question: "The Parthenon is a temple dedicated to which Greek goddess?",
                answerList: [
                    { name: "option1", body: "Hera", isCorrect: false },
                    { name: "option2", body: "Athena", isCorrect: true },
                    { name: "option3", body: "Aphrodite", isCorrect: false },
                    { name: "option4", body: "Artemis", isCorrect: false }
                ]
            },
            {
                questionIndex: 5,
                question: "What river was the lifeline of Ancient Egypt?",
                answerList: [
                    { name: "option1", body: "Amazon", isCorrect: false },
                    { name: "option2", body: "Nile", isCorrect: true },
                    { name: "option3", body: "Tigris", isCorrect: false },
                    { name: "option4", body: "Euphrates", isCorrect: false }
                ]
            },
            {
                questionIndex: 6,
                question: "Which civilization is known for its jaguar warriors?",
                answerList: [
                    { name: "option1", body: "Inca", isCorrect: false },
                    { name: "option2", body: "Aztec", isCorrect: true },
                    { name: "option3", body: "Maya", isCorrect: false },
                    { name: "option4", body: "Olmec", isCorrect: false }
                ]
            },
            {
                questionIndex: 7,
                question: "Who wrote 'The Odyssey'?",
                answerList: [
                    { name: "option1", body: "Socrates", isCorrect: false },
                    { name: "option2", body: "Homer", isCorrect: true },
                    { name: "option3", body: "Plato", isCorrect: false },
                    { name: "option4", body: "Aristotle", isCorrect: false }
                ]
            },
            {
                questionIndex: 8,
                question: "What famous structure was built to protect China from invaders?",
                answerList: [
                    { name: "option1", body: "The Forbidden City", isCorrect: false },
                    { name: "option2", body: "The Great Wall", isCorrect: true },
                    { name: "option3", body: "The Terracotta Army", isCorrect: false },
                    { name: "option4", body: "The Grand Canal", isCorrect: false }
                ]
            },
            {
                questionIndex: 9,
                question: "Which city was destroyed by the eruption of Mount Vesuvius?",
                answerList: [
                    { name: "option1", body: "Rome", isCorrect: false },
                    { name: "option2", body: "Pompeii", isCorrect: true },
                    { name: "option3", body: "Athens", isCorrect: false },
                    { name: "option4", body: "Carthage", isCorrect: false }
                ]
            },
            {
                questionIndex: 10,
                question: "Who was the Queen of Ancient Egypt known for her beauty?",
                answerList: [
                    { name: "option1", body: "Nefertiti", isCorrect: false },
                    { name: "option2", body: "Cleopatra", isCorrect: true },
                    { name: "option3", body: "Hatshepsut", isCorrect: false },
                    { name: "option4", body: "Isis", isCorrect: false }
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
            },
            {
                questionIndex: 3,
                question: "Which method logs a message to the console?",
                answerList: [
                    { name: "option1", body: "print()", isCorrect: false },
                    { name: "option2", body: "console.log()", isCorrect: true },
                    { name: "option3", body: "System.out.println()", isCorrect: false },
                    { name: "option4", body: "log.console()", isCorrect: false }
                ]
            },
            {
                questionIndex: 4,
                question: "What does 'DOM' stand for?",
                answerList: [
                    { name: "option1", body: "Document Object Model", isCorrect: true },
                    { name: "option2", body: "Data Object Model", isCorrect: false },
                    { name: "option3", body: "Digital Ordinance Model", isCorrect: false },
                    { name: "option4", body: "Desktop Orientation Module", isCorrect: false }
                ]
            },
            {
                questionIndex: 5,
                question: "Which operator is used for strict equality?",
                answerList: [
                    { name: "option1", body: "==", isCorrect: false },
                    { name: "option2", body: "===", isCorrect: true },
                    { name: "option3", body: "=", isCorrect: false },
                    { name: "option4", body: "!==", isCorrect: false }
                ]
            },
            {
                questionIndex: 6,
                question: "What is the output of '2' + 2 in JavaScript?",
                answerList: [
                    { name: "option1", body: "4", isCorrect: false },
                    { name: "option2", body: "'22'", isCorrect: true },
                    { name: "option3", body: "NaN", isCorrect: false },
                    { name: "option4", body: "Error", isCorrect: false }
                ]
            },
            {
                questionIndex: 7,
                question: "Which keyword creates a constant variable?",
                answerList: [
                    { name: "option1", body: "var", isCorrect: false },
                    { name: "option2", body: "const", isCorrect: true },
                    { name: "option3", body: "let", isCorrect: false },
                    { name: "option4", body: "static", isCorrect: false }
                ]
            },
            {
                questionIndex: 8,
                question: "What does JSON stand for?",
                answerList: [
                    { name: "option1", body: "JavaScript Object Notation", isCorrect: true },
                    { name: "option2", body: "Java Source Object Network", isCorrect: false },
                    { name: "option3", body: "JavaScript Online Notation", isCorrect: false },
                    { name: "option4", body: "Java Standard Object Node", isCorrect: false }
                ]
            },
            {
                questionIndex: 9,
                question: "How do you check the length of an array?",
                answerList: [
                    { name: "option1", body: ".size", isCorrect: false },
                    { name: "option2", body: ".length", isCorrect: true },
                    { name: "option3", body: ".count", isCorrect: false },
                    { name: "option4", body: ".index", isCorrect: false }
                ]
            },
            {
                questionIndex: 10,
                question: "Which symbol refers to the 'OR' operator?",
                answerList: [
                    { name: "option1", body: "&&", isCorrect: false },
                    { name: "option2", body: "||", isCorrect: true },
                    { name: "option3", body: "!", isCorrect: false },
                    { name: "option4", body: "??", isCorrect: false }
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
            },
            {
                questionIndex: 3,
                question: "Which bird is known for its ability to mimic human speech?",
                answerList: [
                    { name: "option1", body: "Eagle", isCorrect: false },
                    { name: "option2", body: "Parrot", isCorrect: true },
                    { name: "option3", body: "Owl", isCorrect: false },
                    { name: "option4", body: "Penguin", isCorrect: false }
                ]
            },
            {
                questionIndex: 4,
                question: "How many legs does a spider have?",
                answerList: [
                    { name: "option1", body: "6", isCorrect: false },
                    { name: "option2", body: "8", isCorrect: true },
                    { name: "option3", body: "10", isCorrect: false },
                    { name: "option4", body: "12", isCorrect: false }
                ]
            },
            {
                questionIndex: 5,
                question: "Which mammal is known to fly?",
                answerList: [
                    { name: "option1", body: "Flying Squirrel", isCorrect: false },
                    { name: "option2", body: "Bat", isCorrect: true },
                    { name: "option3", body: "Ostrich", isCorrect: false },
                    { name: "option4", body: "Platypus", isCorrect: false }
                ]
            },
            {
                questionIndex: 6,
                question: "What is the largest animal on Earth?",
                answerList: [
                    { name: "option1", body: "Elephant", isCorrect: false },
                    { name: "option2", body: "Blue Whale", isCorrect: true },
                    { name: "option3", body: "Giraffe", isCorrect: false },
                    { name: "option4", body: "Colossal Squid", isCorrect: false }
                ]
            },
            {
                questionIndex: 7,
                question: "What does a panda primarily eat?",
                answerList: [
                    { name: "option1", body: "Meat", isCorrect: false },
                    { name: "option2", body: "Bamboo", isCorrect: true },
                    { name: "option3", body: "Fish", isCorrect: false },
                    { name: "option4", body: "Insects", isCorrect: false }
                ]
            },
            {
                questionIndex: 8,
                question: "Which animal is known as the 'ship of the desert'?",
                answerList: [
                    { name: "option1", body: "Horse", isCorrect: false },
                    { name: "option2", body: "Camel", isCorrect: true },
                    { name: "option3", body: "Donkey", isCorrect: false },
                    { name: "option4", body: "Elephant", isCorrect: false }
                ]
            },
            {
                questionIndex: 9,
                question: "Which fish is famous for having no brain, heart, or blood?",
                answerList: [
                    { name: "option1", body: "Shark", isCorrect: false },
                    { name: "option2", body: "Jellyfish", isCorrect: true },
                    { name: "option3", body: "Clownfish", isCorrect: false },
                    { name: "option4", body: "Starfish", isCorrect: false }
                ]
            },
            {
                questionIndex: 10,
                question: "A group of lions is called a...",
                answerList: [
                    { name: "option1", body: "Herd", isCorrect: false },
                    { name: "option2", body: "Pride", isCorrect: true },
                    { name: "option3", body: "Pack", isCorrect: false },
                    { name: "option4", body: "School", isCorrect: false }
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
            },
            {
                questionIndex: 3,
                question: "Who recorded the album 'Thriller'?",
                answerList: [
                    { name: "option1", body: "Lionel Richie", isCorrect: false },
                    { name: "option2", body: "Michael Jackson", isCorrect: true },
                    { name: "option3", body: "Madonna", isCorrect: false },
                    { name: "option4", body: "Whitney Houston", isCorrect: false }
                ]
            },
            {
                questionIndex: 4,
                question: "Which British singer released the album '21'?",
                answerList: [
                    { name: "option1", body: "Dua Lipa", isCorrect: false },
                    { name: "option2", body: "Adele", isCorrect: true },
                    { name: "option3", body: "Amy Winehouse", isCorrect: false },
                    { name: "option4", body: "Jessie J", isCorrect: false }
                ]
            },
            {
                questionIndex: 5,
                question: "Who is the lead singer of U2?",
                answerList: [
                    { name: "option1", body: "Sting", isCorrect: false },
                    { name: "option2", body: "Bono", isCorrect: true },
                    { name: "option3", body: "The Edge", isCorrect: false },
                    { name: "option4", body: "Mick Jagger", isCorrect: false }
                ]
            },
            {
                questionIndex: 6,
                question: "What instrument did Jimi Hendrix play?",
                answerList: [
                    { name: "option1", body: "Drums", isCorrect: false },
                    { name: "option2", body: "Guitar", isCorrect: true },
                    { name: "option3", body: "Piano", isCorrect: false },
                    { name: "option4", body: "Bass", isCorrect: false }
                ]
            },
            {
                questionIndex: 7,
                question: "Who is known as the 'Queen of Soul'?",
                answerList: [
                    { name: "option1", body: "Diana Ross", isCorrect: false },
                    { name: "option2", body: "Aretha Franklin", isCorrect: true },
                    { name: "option3", body: "Tina Turner", isCorrect: false },
                    { name: "option4", body: "Beyoncé", isCorrect: false }
                ]
            },
            {
                questionIndex: 8,
                question: "The Beatles originated from which UK city?",
                answerList: [
                    { name: "option1", body: "London", isCorrect: false },
                    { name: "option2", body: "Liverpool", isCorrect: true },
                    { name: "option3", body: "Manchester", isCorrect: false },
                    { name: "option4", body: "Birmingham", isCorrect: false }
                ]
            },
            {
                questionIndex: 9,
                question: "Who sang 'I Will Always Love You' in 'The Bodyguard'?",
                answerList: [
                    { name: "option1", body: "Celine Dion", isCorrect: false },
                    { name: "option2", body: "Whitney Houston", isCorrect: true },
                    { name: "option3", body: "Mariah Carey", isCorrect: false },
                    { name: "option4", body: "Dolly Parton", isCorrect: false }
                ]
            },
            {
                questionIndex: 10,
                question: "Which rapper released the album 'The Marshall Mathers LP'?",
                answerList: [
                    { name: "option1", body: "Jay-Z", isCorrect: false },
                    { name: "option2", body: "Eminem", isCorrect: true },
                    { name: "option3", body: "Kanye West", isCorrect: false },
                    { name: "option4", body: "Drake", isCorrect: false }
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
            },
            {
                questionIndex: 3,
                question: "Which country won the 2018 FIFA World Cup?",
                answerList: [
                    { name: "option1", body: "Brazil", isCorrect: false },
                    { name: "option2", body: "France", isCorrect: true },
                    { name: "option3", body: "Germany", isCorrect: false },
                    { name: "option4", body: "Spain", isCorrect: false }
                ]
            },
            {
                questionIndex: 4,
                question: "What sport uses a shuttlecock?",
                answerList: [
                    { name: "option1", body: "Tennis", isCorrect: false },
                    { name: "option2", body: "Badminton", isCorrect: true },
                    { name: "option3", body: "Squash", isCorrect: false },
                    { name: "option4", body: "Ping Pong", isCorrect: false }
                ]
            },
            {
                questionIndex: 5,
                question: "How many players are on a soccer team on the field?",
                answerList: [
                    { name: "option1", body: "9", isCorrect: false },
                    { name: "option2", body: "11", isCorrect: true },
                    { name: "option3", body: "10", isCorrect: false },
                    { name: "option4", body: "12", isCorrect: false }
                ]
            },
            {
                questionIndex: 6,
                question: "Which tennis tournaments are called 'Grand Slams'?",
                answerList: [
                    { name: "option1", body: "2", isCorrect: false },
                    { name: "option2", body: "4", isCorrect: true },
                    { name: "option3", body: "3", isCorrect: false },
                    { name: "option4", body: "5", isCorrect: false }
                ]
            },
            {
                questionIndex: 7,
                question: "In golf, what is a score of one under par called?",
                answerList: [
                    { name: "option1", body: "Eagle", isCorrect: false },
                    { name: "option2", body: "Birdie", isCorrect: true },
                    { name: "option3", body: "Bogey", isCorrect: false },
                    { name: "option4", body: "Par", isCorrect: false }
                ]
            },
            {
                questionIndex: 8,
                question: "Who has won the most Olympic gold medals?",
                answerList: [
                    { name: "option1", body: "Usain Bolt", isCorrect: false },
                    { name: "option2", body: "Michael Phelps", isCorrect: true },
                    { name: "option3", body: "Simone Biles", isCorrect: false },
                    { name: "option4", body: "Carl Lewis", isCorrect: false }
                ]
            },
            {
                questionIndex: 9,
                question: "What is the 'Super Bowl' related to?",
                answerList: [
                    { name: "option1", body: "Baseball", isCorrect: false },
                    { name: "option2", body: "American Football", isCorrect: true },
                    { name: "option3", body: "Hockey", isCorrect: false },
                    { name: "option4", body: "Bowling", isCorrect: false }
                ]
            },
            {
                questionIndex: 10,
                question: "In billiards, what is the color of the 8-ball?",
                answerList: [
                    { name: "option1", body: "White", isCorrect: false },
                    { name: "option2", body: "Black", isCorrect: true },
                    { name: "option3", body: "Red", isCorrect: false },
                    { name: "option4", body: "Blue", isCorrect: false }
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
            },
            {
                questionIndex: 3,
                question: "Which is the smallest continent by land area?",
                answerList: [
                    { name: "option1", body: "Europe", isCorrect: false },
                    { name: "option2", body: "Australia", isCorrect: true },
                    { name: "option3", body: "Antarctica", isCorrect: false },
                    { name: "option4", body: "South America", isCorrect: false }
                ]
            },
            {
                questionIndex: 4,
                question: "Which country is known as the Land of the Rising Sun?",
                answerList: [
                    { name: "option1", body: "China", isCorrect: false },
                    { name: "option2", body: "Japan", isCorrect: true },
                    { name: "option3", body: "Korea", isCorrect: false },
                    { name: "option4", body: "Thailand", isCorrect: false }
                ]
            },
            {
                questionIndex: 5,
                question: "What is the longest river in the world?",
                answerList: [
                    { name: "option1", body: "Amazon River", isCorrect: false },
                    { name: "option2", body: "Nile River", isCorrect: true },
                    { name: "option3", body: "Yangtze River", isCorrect: false },
                    { name: "option4", body: "Mississippi River", isCorrect: false }
                ]
            },
            {
                questionIndex: 6,
                question: "Mount Everest is located in which mountain range?",
                answerList: [
                    { name: "option1", body: "Rockies", isCorrect: false },
                    { name: "option2", body: "Himalayas", isCorrect: true },
                    { name: "option3", body: "Alps", isCorrect: false },
                    { name: "option4", body: "Andes", isCorrect: false }
                ]
            },
            {
                questionIndex: 7,
                question: "Which of these countries is in Africa?",
                answerList: [
                    { name: "option1", body: "Guyana", isCorrect: false },
                    { name: "option2", body: "Kenya", isCorrect: true },
                    { name: "option3", body: "Fiji", isCorrect: false },
                    { name: "option4", body: "Peru", isCorrect: false }
                ]
            },
            {
                questionIndex: 8,
                question: "Which ocean is the largest?",
                answerList: [
                    { name: "option1", body: "Atlantic", isCorrect: false },
                    { name: "option2", body: "Pacific", isCorrect: true },
                    { name: "option3", body: "Indian", isCorrect: false },
                    { name: "option4", body: "Arctic", isCorrect: false }
                ]
            },
            {
                questionIndex: 9,
                question: "Which country is shaped like a boot?",
                answerList: [
                    { name: "option1", body: "Spain", isCorrect: false },
                    { name: "option2", body: "Italy", isCorrect: true },
                    { name: "option3", body: "Greece", isCorrect: false },
                    { name: "option4", body: "Portugal", isCorrect: false }
                ]
            },
            {
                questionIndex: 10,
                question: "What is the capital of Russia?",
                answerList: [
                    { name: "option1", body: "St. Petersburg", isCorrect: false },
                    { name: "option2", body: "Moscow", isCorrect: true },
                    { name: "option3", body: "Kiev", isCorrect: false },
                    { name: "option4", body: "Minsk", isCorrect: false }
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
            },
            {
                questionIndex: 3,
                question: "Who wrote 'To Kill a Mockingbird'?",
                answerList: [
                    { name: "option1", body: "Ernest Hemingway", isCorrect: false },
                    { name: "option2", body: "Harper Lee", isCorrect: true },
                    { name: "option3", body: "F. Scott Fitzgerald", isCorrect: false },
                    { name: "option4", body: "John Steinbeck", isCorrect: false }
                ]
            },
            {
                questionIndex: 4,
                question: "What is the name of the pig in 'Charlotte's Web'?",
                answerList: [
                    { name: "option1", body: "Babe", isCorrect: false },
                    { name: "option2", body: "Wilbur", isCorrect: true },
                    { name: "option3", body: "Porky", isCorrect: false },
                    { name: "option4", body: "Napoleon", isCorrect: false }
                ]
            },
            {
                questionIndex: 5,
                question: "Who wrote 'Pride and Prejudice'?",
                answerList: [
                    { name: "option1", body: "Charlotte Bronte", isCorrect: false },
                    { name: "option2", body: "Jane Austen", isCorrect: true },
                    { name: "option3", body: "Emily Bronte", isCorrect: false },
                    { name: "option4", body: "Virginia Woolf", isCorrect: false }
                ]
            },
            {
                questionIndex: 6,
                question: "In 'Moby Dick', what animal is Moby Dick?",
                answerList: [
                    { name: "option1", body: "Shark", isCorrect: false },
                    { name: "option2", body: "Whale", isCorrect: true },
                    { name: "option3", body: "Squid", isCorrect: false },
                    { name: "option4", body: "Seal", isCorrect: false }
                ]
            },
            {
                questionIndex: 7,
                question: "Who wrote '1984'?",
                answerList: [
                    { name: "option1", body: "Aldous Huxley", isCorrect: false },
                    { name: "option2", body: "George Orwell", isCorrect: true },
                    { name: "option3", body: "Ray Bradbury", isCorrect: false },
                    { name: "option4", body: "J.R.R. Tolkien", isCorrect: false }
                ]
            },
            {
                questionIndex: 8,
                question: "Who creates the ring in 'The Lord of the Rings'?",
                answerList: [
                    { name: "option1", body: "Gandalf", isCorrect: false },
                    { name: "option2", body: "Sauron", isCorrect: true },
                    { name: "option3", body: "Saruman", isCorrect: false },
                    { name: "option4", body: "Frodo", isCorrect: false }
                ]
            },
            {
                questionIndex: 9,
                question: "Which detective lives at 221B Baker Street?",
                answerList: [
                    { name: "option1", body: "Hercule Poirot", isCorrect: false },
                    { name: "option2", body: "Sherlock Holmes", isCorrect: true },
                    { name: "option3", body: "Nancy Drew", isCorrect: false },
                    { name: "option4", body: "Miss Marple", isCorrect: false }
                ]
            },
            {
                questionIndex: 10,
                question: "The 'Great Gatsby' is set during which decade?",
                answerList: [
                    { name: "option1", body: "1950s", isCorrect: false },
                    { name: "option2", body: "1920s", isCorrect: true },
                    { name: "option3", body: "1890s", isCorrect: false },
                    { name: "option4", body: "1980s", isCorrect: false }
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
            },
            {
                questionIndex: 3,
                question: "Which is the largest organ in the human body?",
                answerList: [
                    { name: "option1", body: "Heart", isCorrect: false },
                    { name: "option2", body: "Skin", isCorrect: true },
                    { name: "option3", body: "Liver", isCorrect: false },
                    { name: "option4", body: "Lungs", isCorrect: false }
                ]
            },
            {
                questionIndex: 4,
                question: "How many days are in a leap year?",
                answerList: [
                    { name: "option1", body: "365", isCorrect: false },
                    { name: "option2", body: "366", isCorrect: true },
                    { name: "option3", body: "364", isCorrect: false },
                    { name: "option4", body: "360", isCorrect: false }
                ]
            },
            {
                questionIndex: 5,
                question: "What comes after the letter 'A'?",
                answerList: [
                    { name: "option1", body: "C", isCorrect: false },
                    { name: "option2", body: "B", isCorrect: true },
                    { name: "option3", body: "D", isCorrect: false },
                    { name: "option4", body: "E", isCorrect: false }
                ]
            },
            {
                questionIndex: 6,
                question: "What is the chemical symbol for water?",
                answerList: [
                    { name: "option1", body: "O2", isCorrect: false },
                    { name: "option2", body: "H2O", isCorrect: true },
                    { name: "option3", body: "CO2", isCorrect: false },
                    { name: "option4", body: "NaCl", isCorrect: false }
                ]
            },
            {
                questionIndex: 7,
                question: "Which season comes after Summer?",
                answerList: [
                    { name: "option1", body: "Winter", isCorrect: false },
                    { name: "option2", body: "Autumn", isCorrect: true },
                    { name: "option3", body: "Spring", isCorrect: false },
                    { name: "option4", body: "Monsoon", isCorrect: false }
                ]
            },
            {
                questionIndex: 8,
                question: "How many continents are there?",
                answerList: [
                    { name: "option1", body: "5", isCorrect: false },
                    { name: "option2", body: "7", isCorrect: true },
                    { name: "option3", body: "6", isCorrect: false },
                    { name: "option4", body: "8", isCorrect: false }
                ]
            },
            {
                questionIndex: 9,
                question: "What does the cow say?",
                answerList: [
                    { name: "option1", body: "Meow", isCorrect: false },
                    { name: "option2", body: "Moo", isCorrect: true },
                    { name: "option3", body: "Woof", isCorrect: false },
                    { name: "option4", body: "Oink", isCorrect: false }
                ]
            },
            {
                questionIndex: 10,
                question: "Which planet do we live on?",
                answerList: [
                    { name: "option1", body: "Mars", isCorrect: false },
                    { name: "option2", body: "Earth", isCorrect: true },
                    { name: "option3", body: "Venus", isCorrect: false },
                    { name: "option4", body: "Jupiter", isCorrect: false }
                ]
            }
        ]
    }
];
