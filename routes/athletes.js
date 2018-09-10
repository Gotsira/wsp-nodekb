const express = require('express')
const router = express.Router()

// Bring in Athlete Models
let Athlete = require('../models/athlete') 

// User Model
let User = require('../models/user')
  
// Add Route
router.get('/add', ensureAuthenticated, function (req, res) {
    res.render('add_athletes',{
    title: "Add Athlete"
    })
})

// Update Submit POST Route
router.post('/edit/:id', function(req, res) {
    let athlete = {};
    athlete.name = req.body.name
    athlete.club = req.body.club
    athlete.league = req.body.league
    athlete.title = req.body.title
    athlete.author = req.user._id
    athlete.body = req.body.body

    let query = {_id:req.params.id}

    Athlete.update(query, athlete, function(err) {
        if(err) {
        console.log(err)
        return
        } else {
        res.redirect('/')
        }
    })
})

// Delete athlete
router.delete('/:id', function(req, res) {
    if(!req.user._id) {
        res.status(500).send()
    }
    let query = {_id: req.params.id}

    Athlete.findById(req.params.id, function(err, athlete) {
        if(athlete.author != req.user._id) {
            res.status(500).send()
        } else {
            athlete.remove(query, function(err) {
                if(err) {
                    console.log(err)
                }
                res.send('Success')
            })
        }
    })    
})

// Add Submit POST Route
router.post('/add', function(req, res) {
    req.checkBody('name', 'Name is required').notEmpty()
    req.checkBody('club', 'Club is required').notEmpty()
    req.checkBody('title', 'Title is required').notEmpty()
    req.checkBody('league', 'League is required').notEmpty()
    req.checkBody('body', 'Body is required').notEmpty()

    // Get Errors
    let errors = req.validationErrors()

    if(errors) {
        res.render('add_athletes', {
        title: 'Add Athlete',
        errors: errors
        })
    } else {
        let athlete = new Athlete()
        athlete.name = req.body.name
        athlete.club = req.body.club
        athlete.league = req.body.league
        athlete.title = req.body.title
        athlete.author = req.user._id
        athlete.body = req.body.body

        athlete.save(function(err) {
        if(err) {
            console.log(err)
            return
        } else {
            req.flash('success', 'Athlete Added')
            res.redirect('/')
        }
        })
    }  
})

// Load Edit Form
router.get('/edit/:id', function(req, res) {
    Athlete.findById(req.params.id, function(err, athlete){
        if(athlete.author != req.user._id) {
            req.flash('danger', 'Not Authorized');
            return res.redirect('/');
        }
        res.render('edit_athlete', {
            title: 'Edit Athlete',
            athlete: athlete
        })
    })
})

// Get Single athlete
router.get('/:id', function(req, res) {
    Athlete.findById(req.params.id, function(err, athlete){
        User.findById(athlete.author, function(err, user) {
            res.render('athlete', {
                athlete: athlete,
                author: user.name
            })
        })
    })
})

// Access Control
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
         return next()
    } else {
        req.flash('danger', 'Please login')
        res.redirect('/users/login')
    }
  }

module.exports = router