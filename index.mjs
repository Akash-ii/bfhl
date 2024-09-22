import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';  // Import cors

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Use body-parser to parse JSON bodies
app.use(bodyParser.json());

const user_id = "john_doe_17091999";
const email = "john@xyz.com";
const roll_number = "ABCD123";

// Helper function to decode base64 and validate the file (MIME type and size)
const handleFileValidation = (file_b64) => {
    let file_valid = false;
    let file_mime_type = null;
    let file_size_kb = null;

    if (file_b64) {
        try {
            // Decode the base64 string to get file information
            const fileBuffer = Buffer.from(file_b64, 'base64');
            file_size_kb = (fileBuffer.length / 1024).toFixed(2); // File size in KB

            // Example MIME type (this logic can be improved)
            if (file_b64.startsWith('iVBOR')) {
                file_mime_type = 'image/png';
            } else if (file_b64.startsWith('/9j/')) {
                file_mime_type = 'image/jpeg';
            } else {
                file_mime_type = 'application/octet-stream'; // Fallback MIME type
            }

            file_valid = true; // Assuming valid file if it reaches here
        } catch (err) {
            console.error('Invalid file format');
        }
    }

    return { file_valid, file_mime_type, file_size_kb };
};

// POST route for BFHL
app.post('/bfhl', (req, res) => {
    const { data, file_b64 } = req.body;

    // Validate 'data' is an array
    if (!Array.isArray(data)) {
        return res.status(400).json({
            is_success: false,
            user_id,
            email,
            roll_number,
            numbers: [],
            alphabets: [],
            highest_lowercase_alphabet: [],
            file_valid: false,
            file_mime_type: null,
            file_size_kb: null
        });
    }

    // Separate numbers and alphabets
    const numbers = data.filter(item => !isNaN(item));
    const alphabets = data.filter(item => /^[A-Za-z]$/.test(item));

    // Find highest lowercase alphabet (from 'a' to 'z')
    const lowercase_alphabets = alphabets.filter(letter => letter === letter.toLowerCase());
    const highest_lowercase_alphabet = lowercase_alphabets.length > 0 ? [lowercase_alphabets.sort().reverse()[0]] : [];

    // Handle the file validation
    const { file_valid, file_mime_type, file_size_kb } = handleFileValidation(file_b64);

    // Respond with the formatted JSON
    res.json({
        is_success: true,
        user_id,
        email,
        roll_number,
        numbers,
        alphabets,
        highest_lowercase_alphabet,
        file_valid,
        file_mime_type,
        file_size_kb
    });
});

// GET route
app.get('/bfhl', (req, res) => {
    res.json({
        operation_code: 1
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

