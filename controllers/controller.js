// ## Starter Template for Route Logic ##

// Imports
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const path = require('path');
const Model = require('../models/model');
const { USER_KEYS } = require('../utility/util')


/**
 * Controller for a private route
 * Sends a response indicating access to a private route
 */
const get_secrets_page = async (req, res) => {
    try {
        // let student = await studentModel.find({[USER_KEYS]: year}, `${S_KEYS.NAME} ${S_KEYS.ROLL_NO} ${S_KEYS.BRANCH} ${S_KEYS.YEAR}`);
        // let user = await Model.find(req.id);

        // if(user){
        //     return req.json({
        //         user: user
        //     })
        // }

        return res.status(200).sendFile(path.join(__dirname, '../views/html/secrets.html'));
    } catch (error) {
        console.error('[-] Error in home route:', error.message);
        return res.status(500).json({
            error: error.message
        });
    }
}

// Exports
module.exports = {
    get_secrets_page
};
