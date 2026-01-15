import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth/login';

async function login() {
    try {
        console.log("Attempting login...");
        const response = await axios.post(API_URL, {
            email: "admin@example.com",
            password: "password123"
        });
        console.log("SUCCESS: Login successful.");
        console.log("Token:", response.data.token ? "Received" : "Missing");
    } catch (error) {
        if (error.response) {
            console.log("ERROR Response:", error.response.status, error.response.data);
        } else {
            console.error("ERROR:", error.message);
        }
    }
}

async function testPost() {
    try {
        console.log("Attempting POST /test...");
        const response = await axios.post('http://localhost:3001/test', {});
        console.log("SUCCESS: /test works.", response.data);

        const responseManual = await axios.post('http://localhost:3001/manual-login', {});
        console.log("SUCCESS: /manual-login works.", responseManual.data);

        // Test root mount
        console.log("Attempting POST /login (Root Mount)...");
        const responseRoot = await axios.post('http://localhost:3001/login', {
            email: "admin@example.com",
            password: "password123"
        });
        // Test Manual Invocation
        console.log("Attempting POST /manual-invoke-login...");
        const responseManualInvoke = await axios.post('http://localhost:3001/manual-invoke-login', {
            email: "admin@example.com",
            password: "password123"
        });
        console.log("SUCCESS: /manual-invoke-login works.");
        // Test Inline
        console.log("Attempting POST /inline/login...");
        const responseInline = await axios.post('http://localhost:3001/inline/login', {
            email: "admin@example.com",
            password: "password123"
        });
        console.log("SUCCESS: /inline/login works.", responseInline.data);

    } catch (e) {
        console.error("ERROR:", e.message);
        if (e.response) console.log("Response:", e.response.status);
    }
}

testPost();
// login(); // Disable old login call for now to focus on these
