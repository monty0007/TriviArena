const mongoose = require('mongoose');
const Quiz = require('../models/quiz');

// Create a new quiz
const createQuiz = async (req, res) => {
    const { name, backgroundImage, description, creatorName, creatorId, pointsPerQuestion, isPublic, tags, likesCount, questionList,  questionType,
        pointType,
        answerTime,
        numberOfQuestions, 
        _id
        // isPublic,
     } = req.body;

    // if (!creatorId) {
        // return res.status(400).json({ message: 'Creator ID is required' });
    // }

    const quiz = new Quiz({
        name,
        // backgroundImage,
        // description,
        creatorId,
        creatorName,
        // pointsPerQuestion,
        // numberOfQuestions: questionList.length,
        numberOfQuestions,
        questionType,
        pointType,
        answerTime,
        // isPublic,
        _id,
        questionList,
        // dateCreated: new Date().toISOString(),
    });

    try {
        const newQuiz = await quiz.save();
        res.status(201).json(newQuiz);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all quizzes
const getQuizes = async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get teacher quizzes
const getTeacherQuizes = async (req, res) => {
    const teacherId = req.params.teacherId;
    try {
        const quizzes = await Quiz.find({ creatorId: teacherId });
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get public quizzes with pagination
const getPublicQuizes = async (req, res) => {
    const { page = 1 } = req.query;
    const LIMIT = 6;
    const startIndex = (Number(page) - 1) * LIMIT;

    try {
        const total = await Quiz.countDocuments({ isPublic: true });
        const quizzes = await Quiz.find({ isPublic: true })
            .sort({ _id: -1 })
            .limit(LIMIT)
            .skip(startIndex);

        res.status(200).json({
            data: quizzes,
            currentPage: Number(page),
            numberOfPages: Math.ceil(total / LIMIT),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single quiz by ID
const getQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a quiz by ID
const deleteQuiz = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No quiz found with id: ${id}`);
    }

    try {
        await Quiz.findByIdAndDelete(id);
        res.json({ message: "Quiz deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a quiz by ID
const updateQuiz = async (req, res) => {
    const { id } = req.params;
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //     return res.status(404).send(`No quiz found with id: ${id}`);
    // }

    const { name, backgroundImage, description, pointsPerQuestion, isPublic, tags, numberOfQuestions, questionList } = req.body;

    const quiz = {
        _id: id,
        name,
        numberOfQuestions,
        questionList,
    };

    try {
        const updatedQuiz = await Quiz.findByIdAndUpdate(id, quiz, { new: true });
        if (!updatedQuiz) {
            return res.status(404).json({ message: `No quiz found with id: ${id}` });
          }
        res.json(updatedQuiz);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const addQuestion = async (req, res) => {
    const { quizId } = req.params;
    const { questionType, question, questionIndex, pointType, answerTime, answerList, correctAnswersList } = req.body;

    try {
        let quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Add question with provided questionIndex
        quiz.questionList.push({
            questionType,
            question,
            questionIndex,
            pointType,
            answerTime,
            answerList,
            correctAnswersList
        });
        
        // Update numberOfQuestions
        quiz.numberOfQuestions += 1;

        const updatedQuiz = await quiz.save();
        res.json(updatedQuiz);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



// Get all questions of a quiz
const getQuestions = async (req, res) => {
    const { quizId } = req.params;
    try {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        res.status(200).json(quiz.questionList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single question from a quiz
const getQuestion = async (req, res) => {
    const { quizId, questionId } = req.params;

    try {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        const question = quiz.questionList.id(questionId);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }
        res.json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a question from a quiz
const deleteQuestion = async (req, res) => {
    const { quizId, questionId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
        return res.status(404).send(`No quiz found with id: ${quizId}`);
    }
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
        return res.status(404).send(`No question found with id: ${questionId}`);
    }

    try {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        quiz.questionList = quiz.questionList.filter(q => q._id.toString() !== questionId);
        quiz.numberOfQuestions -= 1;

        await quiz.save();
        res.json({ message: "Question deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a question in a quiz
const updateQuestion = async (req, res) => {
    const { quizId, questionId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
        return res.status(404).send(`No quiz found with id: ${quizId}`);
    }
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
        return res.status(404).send(`No question found with id: ${questionId}`);
    }

    const { questionType, question, pointType, answerTime, answerList, correctAnswersList } = req.body;

    try {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        const questionIndex = quiz.questionList.findIndex(q => q._id.toString() === questionId);
        if (questionIndex === -1) {
            return res.status(404).json({ message: "Question not found" });
        }

        quiz.questionList[questionIndex] = {
            _id: questionId,
            questionType,
            question,
            pointType,
            answerTime,
            answerList,
            correctAnswersList
        };

        const updatedQuiz = await quiz.save();
        res.json(updatedQuiz);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createQuiz,
    getQuizes,
    getPublicQuizes,
    getTeacherQuizes,
    getQuiz,
    deleteQuiz,
    updateQuiz,
    addQuestion,
    getQuestions,
    getQuestion,
    updateQuestion,
    deleteQuestion,
};
