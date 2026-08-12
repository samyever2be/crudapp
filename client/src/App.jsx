import axios from 'axios'
import { useState, useEffect } from 'react'
import './App.css'

function App() {
    const [users, setUsers] = useState([]);
    const [filterusers, setFilterusers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [userData, setUserData] = useState({
        name: "",
        age: "",
        city: ""
    });

    const getAllUsers = async () => {
        await axios.get("http://localhost:8000/users")
            .then((res) => {
                setUsers(res.data);
                setFilterusers(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    const handleSearchChange = (value) => {

        const filteredUsers = users.filter((user) => {
            return (
                user.name.toLowerCase().includes(value.toLowerCase()) ||
                user.age.toString().includes(value) ||
                user.city.toLowerCase().includes(value.toLowerCase())
            );
        });

        setFilterusers(filteredUsers);
    };

    const handleDeleteUser = async (id) => {

        const isConfirmed = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (isConfirmed) {
            try {

                const res = await axios.delete(
                    `http://localhost:8000/users/${id}`
                );

                setUsers(res.data);
                setFilterusers(res.data);

            } catch (err) {
                console.log(err);
            }
        }
    };

    const handleAddRecord = () => {

        setUserData({
            name: "",
            age: "",
            city: ""
        });

        setIsModalOpen(true);
    };

    const handleData = (e) => {

        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            // UPDATE
            if (userData.id) {

                await axios.patch(
                    `http://localhost:8000/users/${userData.id}`,
                    {
                        name: userData.name,
                        age: userData.age,
                        city: userData.city
                    }
                );

            }

            // ADD
            else {

                await axios.post(
                    "http://localhost:8000/users",
                    {
                        name: userData.name,
                        age: userData.age,
                        city: userData.city
                    }
                );

            }

            // Get latest users after Add / Update
            await getAllUsers();

            // Close modal
            setIsModalOpen(false);

            // Reset form
            setUserData({
                name: "",
                age: "",
                city: ""
            });

        } catch (err) {

            console.log(err);

        }
    };

    const handleUpdateRecord = (user) => {

        setUserData({
            id: user.id,
            name: user.name,
            age: user.age,
            city: user.city
        });

        setIsModalOpen(true);
    };

    return (
        <>
            <div className="container">

                <h1>CRUD App</h1>

                <div className="input-search">

                    <input
                        type="search"
                        placeholder="Search..."
                        onChange={(e) =>
                            handleSearchChange(e.target.value)
                        }
                    />

                    <button
                        className="btn"
                        onClick={handleAddRecord}
                    >
                        Add Record
                    </button>

                </div>

                <table className="table">

                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>City</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {filterusers &&
                            filterusers.map((user, index) => {

                                return (
                                    <tr key={user.id}>

                                        <td>
                                            {index + 1}
                                        </td>

                                        <td>
                                            {user.name}
                                        </td>

                                        <td>
                                            {user.age}
                                        </td>

                                        <td>
                                            {user.city}
                                        </td>

                                        <td>

                                            <button
                                                className="btn green"
                                                onClick={() =>
                                                    handleUpdateRecord(user)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="btn red"
                                                onClick={() =>
                                                    handleDeleteUser(user.id)
                                                }
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>
                                );
                            })}

                    </tbody>

                </table>

                {isModalOpen && (

                    <div className="modal">

                        <div className="modal-content">

                            <span
                                className="close"
                                onClick={() =>
                                    setIsModalOpen(false)
                                }
                            >
                                &times;
                            </span>

                            <h2>
                                {userData.id
                                    ? "Update User"
                                    : "Add User"}
                            </h2>

                            <div className="input-group">

                                <label htmlFor="name">
                                    Name:
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={userData.name}
                                    onChange={handleData}
                                />

                            </div>

                            <div className="input-group">

                                <label htmlFor="age">
                                    Age:
                                </label>

                                <input
                                    type="number"
                                    name="age"
                                    id="age"
                                    value={userData.age}
                                    onChange={handleData}
                                />

                            </div>

                            <div className="input-group">

                                <label htmlFor="city">
                                    City:
                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    id="city"
                                    value={userData.city}
                                    onChange={handleData}
                                />

                            </div>

                            <button
                                className="btn green"
                                onClick={handleSubmit}
                            >
                                {userData.id
                                    ? "Update User"
                                    : "Add User"}
                            </button>

                        </div>

                    </div>

                )}

            </div>
        </>
    );
}

export default App
