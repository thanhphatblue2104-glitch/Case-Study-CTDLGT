
const run = async () => {
    try {
        console.log("Attempting to create product...");
        const response = await fetch('http://localhost:3000/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: "Test Coke",
                barcode: "TEST_12345",
                category: "Beverage",
                unit: "Start",
                image: "https://example.com/coke.png"
            })
        });

        if (!response.ok) {
            const data = await response.json();
            console.error("First Attempt Failed:", response.status, data);
        } else {
            const data = await response.json();
            console.log("First Attempt Success:", data);
        }

        console.log("Attempting to create DUPLICATE product...");
        const response2 = await fetch('http://localhost:3000/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Test Coke 2", // Different name
                barcode: "TEST_12345", // SAME Barcode
                category: "Beverage",
                unit: "Start",
                image: "https://example.com/coke.png"
            })
        });

        if (!response2.ok) {
            const data = await response2.json();
            console.error("Second Attempt (Duplicate) Failed:", response2.status, data);
        } else {
            const data = await response2.json();
            console.log("Second Attempt (Duplicate) Success (Should return existing):", data);
        }
    } catch (error: any) {
        console.error("Network Error:", error);
    }
};

run();
