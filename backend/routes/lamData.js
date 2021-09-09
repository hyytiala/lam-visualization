const express = require('express')
const { spawn } = require('child_process')

const router = express.Router()

router.get('/check', (req, res) => {
  return res.send('Backend running')
})

router.get('/', (req, res) => {
  let dataToSend
  const python = spawn('python3', ['./scripts/parser.py', req.query.year, req.query.ely, req.query.lam, req.query.day])
  python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...')
    dataToSend = data.toString()
  })

  python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`)
    if (code === 0) {
      res.send(dataToSend)
    } else {
      res.sendStatus(404)
    }
  })
})

module.exports = router