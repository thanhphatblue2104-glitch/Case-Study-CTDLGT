import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth/register';

async function register() {
    try {
        const response = await axios.post(API_URL, {
            email: "admin@warehouse.com",
            password: "123456",
            name: "Admin"
        });
        console.log("SUCCESS: User registered.");
        console.log(response.data);
    } catch (error) {
        if (error.response) {
            console.log("ERROR Response:", error.response.data);
            if (error.response.data.error === "User already exists") {
                console.log("SUCCESS: User already exists. Use credentials.");
            }
        } else {
            console.error("ERROR:", error.message);
        }
    }
}

register();
