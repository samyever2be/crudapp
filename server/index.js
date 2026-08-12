const express = require('express');
const app = express();

const cors = require('cors');
const fs = require('fs');

const port = 8000;
const users = require('./sample.json');

app.use(cors());
app.use(express.json());

// GET all users
app.get("/users", (req, res) => {
    return res.json(users);
});

// DELETE user
app.delete("/users/:id", (req, res) => {
    const id = Number(req.params.id);

    const filteredUsers = users.filter(
        (user) => user.id !== id
    );

    fs.writeFile(
        './sample.json',
        JSON.stringify(filteredUsers, null, 2),
        (err) => {
            if (err) {
                return res.status(500).json({
                    message: "Failed to delete user"
                });
            }

            users.length = 0;
            users.push(...filteredUsers);

            return res.json(users);
        }
    );
});

// POST user
app.post("/users", (req, res) => {
    let { name, age, city } = req.body;

    if (!name || !age || !city) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    let id = Date.now();

    users.push({
        id,
        name,
        age,
        city
    });

    fs.writeFile(
        './sample.json',
        JSON.stringify(users, null, 2),
        (err) => {
            if (err) {
                return res.status(500).json({
                    message: "Failed to save user"
                });
            }

            return res.json(users);
        }
    );
});

// UPDATE user
app.patch("/users/:id", (req, res) => {
    const id = Number(req.params.id);

    let { name, age, city } = req.body;

    if (!name || !age || !city) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const userIndex = users.findIndex(
        (user) => user.id === id
    );

    if (userIndex === -1) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    users.splice(userIndex, 1, {
        id,
        name,
        age,
        city
    });

    fs.writeFile(
        './sample.json',
        JSON.stringify(users, null, 2),
        (err) => {
            if (err) {
                return res.status(500).json({
                    message: "Failed to update user"
                });
            }

            return res.json({
                message: "User updated successfully"
            });
        }
    );
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});