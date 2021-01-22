const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const LinkedList = require('./LinkedList')
const bodyParser = express.json();

const languageRouter = express.Router()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    // implement me
    try {
      const word = await LanguageService.getLanguageHead(
        req.app.get('db'),
        req.language.id,
        req.language.head
      )

      res.json({
        nextWord: word.original,
        totalScore: req.language.total_score,
        wordCorrectCount: word.correct_count,
        wordIncorrectCount: word.incorrect_count,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .post('/guess', bodyParser, async (req, res, next) => {
    // implement me

    const { guess } = req.body

    if(!guess)
      return res.status(400).json({
        error: `Missing 'guess' in request body`,
      })

    try {

      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )  

      const list = new LinkedList
      
      list.makeLinkedList(words, req.language.head)
      const guessRes = list.checkGuess(guess)
      // list.printList()
      console.log(guessRes.data.new_head.id, guessRes.data.new_head.next)

      let score = guessRes.correct ? req.language.total_score++ : req.language.total_score

      await LanguageService.updateLanguage(
        req.app.get('db'),
        req.language.id,
        score,
        guessRes.data.new_head.id
      )

      // const language = await LanguageService.getUsersLanguage(
      //   req.app.get('db'),
      //   req.user.id,
      // )

      // console.log(language)


      const head = await LanguageService.updateWords(
        req.app.get('db'),
        guessRes.data
      )

      // console.log(words, 'head')

      // const word = await LanguageService.getLanguageHead(
      //   req.app.get('db'),
      //   req.language.id,
      //   req.language.head
      // )

      // console.log(word)
      // // list.printId()
      // // console.log(guessRes.data.new_head.id)

      //   console.log(guessRes.correct)
      //   console.log(tempScore, 'tempscore')
      //     console.log('head is ' + req.language.head, guessRes.data.new_head.id)
      //   // make this to update database 
      
      res.json({
        answer: guessRes.data.old_head.translation,
        isCorrect: guessRes.correct,
        nextWord: guessRes.data.old_head.original, // fix this
        totalScore: score, // fix this
        wordCorrectCount: guessRes.data.old_head.correct_count,
        wordIncorrectCount: guessRes.data.old_head.incorrect_count,
      })
    } catch (error) {
      next(error)
    }
  })

module.exports = languageRouter
