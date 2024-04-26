const cookieHelper = require('./cookie.helper.cjs');

const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const userModel = require('./db/user.model.cjs')

// localhost:8000/users/?startOfUsername=h
router.post('/register', async function(request, response) {
    const requestBody = request.body;

    const username = requestBody.username;
    const password = requestBody.password;

    const newUser = {
        username: username,
        password: password
    };

    try {
        const createUserResponse = await userModel.insertUser(newUser);

        const cookieData = {username: username};
        
        const token = jwt.sign(cookieData, 'POKEMON_SECRET', {
            expiresIn: '14d'
        });

        response.cookie('token', token, {httpOnly: true});

        return response.send('User with username ' + username + ' created.' )
    } catch (error) {
        response.status(400);
        return response.send('Failed to create user with message ' + error)
    }
});

router.post('/login', async function(request, response) {
    const username = request.body.username;
    const password = request.body.password

    try {
        const getUserResponse = await userModel.getUserByUsername(username);
        if(!getUserResponse) {
            response.status(400);
            return response.send('No user found.')
        }

        if (password !== getUserResponse.password) {
            response.status(400)
            return response.send('Passwords don\'t match.' )
        }

        const cookieData = {username: username};
        
        const token = jwt.sign(cookieData, 'POKEMON_SECRET', {
            expiresIn: '14d'
        });

        response.cookie('token', token, {httpOnly: true});

        return response.send('Logged in!' )
    } catch (error) {
        response.status(400);
        return response.send('Failed to login: ' + error)
    }
});

router.get('/loggedIn', function(request, response) {
    const username = cookieHelper.cookieDecryptor(request);
    console.log("checked login")
    console.log(username)
    if(username) {
        return response.send({
            username: username,
        });
    } else {
        response.status(400);
        return response.send('Not logged in');
    }
})

router.get('/:username', async function(request, response) {
    const username = request.params.username;
    console.log(username);
    try {
        const getPokemonResponse = await userModel.getUserByUsername(username);
        return response.send(getPokemonResponse);
    } catch (error) {
        response.status(400);
        return response.send(error);
    }
})

router.post('/logout', function(request, response) {
    response.clearCookie('username');
    return response.send('Logged out');
});

// router.get('/:owner', async function(request, response) {
//     const owner = request.params.owner;

//     if(!owner){
//         return response.send("Missing username")
//     }

//     try {
//         const passwords = await userModel.getPokemonByOwner(owner);
//         return response.json(passwords);
//     } catch (error) {
//         console.error('Error:', error);
//         return response.status(500).send(error);
//     }
// });

router.put('/:username', async function(req, res) {
    const username = req.params.username;
    const sharedByUsers = req.body;
    // console.log(1);
    if(!username) {
        res.status(401);
        return res.send("You need a user to update sharedByUsers!")
    }

    if (!sharedByUsers) {
        // console.log(sharedByUsers)
        // console.log(1)

        res.status(400);
        return res.send("No users are sharing passwords with you.");
    }

    try {
        const getUserResponse = await userModel.getUserByUsername(username);
        console.log("sharedByUsers: " + sharedByUsers)
        if(getUserResponse === null) {
            // console.log(2)
            res.status(400);
            return res.send("Username doesn't exists");
        }

        const pokemonUpdateResponse = await userModel.updateUsers(username, sharedByUsers);
        return res.send('Successfully updated user ' + username)
    } catch (error) {
        res.status(400);
        // console.log(3)
        return res.send(error);
    }
})


// router.post('/', function(request, response) {
//     const body = request.body;

//     const username = body.username;

//     if(!username) {
//         response.status(401);
//         return response.send("Missing username")
//     }

//     const trainerId = Math.floor(Math.random() * 1000);

//     users.push({
//         username: username,
//         trainerId: trainerId,
//     })

//     response.json("Successfully created user with trainer ID " + trainerId)
// })




// Define a route to get a list of user passwords by userid
// router.get('/passwords/:username', async (req, res) => {
//     const username = req.params.username;
//     if (!username) {
//         return res.status(404).json({ message: 'User not found' });
//       }
//     try {
//       // Find the user document by userId
//     //   const userList = userModel.getSendersByUserID(userId);
//         const senderResponse = await userModel.getUserByUsername(username);
//       console.log(senderResponse)

//       const passwords = await

//     // Iterate over each user object in the userList
//     // for (const userDocument of userList) {
//         // Push the password of the user to the passwords array
//         passwords.push(senderResponse.password);
//     // }  
//     return res.send(passwords)
    
//     } catch (error) {
//       console.error('Error:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });

module.exports = router;