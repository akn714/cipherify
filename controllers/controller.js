// ## Starter Template for Route Logic ##

// Imports
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const path = require('path');
const Model = require('../models/model');
const { USER_KEYS } = require('../utility/util')


const get_secrets = async (req, res) => {
    try {
        // let student = await studentModel.find({[USER_KEYS]: year}, `${S_KEYS.NAME} ${S_KEYS.ROLL_NO} ${S_KEYS.BRANCH} ${S_KEYS.YEAR}`);
        let user = await Model.findById(req.id);
        if(user){
            return res.status(200).json({
                data: user.secrets
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
}

/**
 * Controller for a private route
 * Sends a response indicating access to a private route
 */
const get_secrets_page = async (req, res) => {
    try {
        return res.status(200).sendFile(path.join(__dirname, '../views/html/secrets.html'));
    } catch (error) {
        console.error('[-] Error in user route:', error.message);
        return res.status(500).json({
            error: error.message
        });
    }
}

const get_add_secret_page = (req, res) => {
    try {
        return res.status(200).sendFile(path.join(__dirname, '../views/html/add_secret.html'));
    } catch (error) {
        console.error('[-] Error in user route:', error.message);
        return res.status(500).json({
            error: error.message
        });
    }
}

const add_secret = async (req, res) => {
    try {
        const newSecret = {
            URL: req.body.url,
            USERNAME: req.body.username,
            PASSWORD: req.body.password
        };
        
        // Fetch the user, modify the array, and save
        Model.findById(req.id) // Replace with the user's ID
            .then(user => {
                if (!user) {
                    throw new Error('User not found');
                }
        
                // Add the new object to the secrets array
                user.secrets.push(newSecret);
        
                // Save the updated user
                return user.save();
            })
            .then(updatedUser => {
                console.log('Updated User:', updatedUser);
            })
            .catch(err => {
                console.error(err);
            });
        
        res.redirect('/user');
    } catch (error) {
        
    }
}

const delete_secret = async (req, res) => {
    try {
        // implementation left
        res.status(200).json({
            message: 'deleting secret'
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
}

// Exports
module.exports = {
    get_secrets,
    get_secrets_page,
    add_secret,
    get_add_secret_page,
    delete_secret
};
