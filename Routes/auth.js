const { Router } = require('express')
const bcrypt = require('bcryptjs')
const router = require('express').Router();
const User = require('../Model/User');
const {loginValidation, registerValidation} = require('../validation')
const jwt = require('jsonwebtoken')


router.post('/register', async (req, res) => {
    // Validate data
    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // Check if user exists
    const emailExists = await User.findOne({email: req.body.email});
    if (emailExists) return res.status(400).send('Email already exists');

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    // Create new nuser
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    // Save the new user to the DB
    try {
        const savedUser = await user.save();
        res.send({user: user._id})
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/login',  async (req, res) => {
    // Validate data
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // Check if email exists
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Email or password is incorrect');

    // Is password correct
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send('Email or password is incorrect');

    // Create Jwt
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

});

module.exports = router