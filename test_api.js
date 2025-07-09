// test_api.js
// Simple test script to verify the new post structure

const baseURL = "http://localhost:8000";

// Helper function to make API requests
async function makeRequest(endpoint, options = {}) {
    const response = await fetch(`${baseURL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    });

    const data = await response.json();
    console.log(`${options.method || 'GET'} ${endpoint}:`, response.status, data);
    return { response, data };
}

async function testRefactoredPosts() {
    console.log('🧪 Testing refactored post structure...\n');

    try {
        // 1. Test signup
        console.log('1. Testing signup...');
        const signupResult = await makeRequest('/server/auth/signup', {
            method: 'POST',
            body: JSON.stringify({
                name: 'testuser',
                pass: 'testpass123'
            })
        });

        if (!signupResult.data.success) {
            console.error('❌ Signup failed');
            return;
        }

        const accessToken = signupResult.data.data.accessToken;
        console.log('✅ Signup successful\n');

        // 2. Test creating a text post
        console.log('2. Testing text post creation...');
        const textPostResult = await makeRequest('/server/posts/create', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                type: 'text',
                content: 'Hello, this is a text post!',
                date: new Date().toISOString()
            })
        });

        if (textPostResult.data.success) {
            console.log('✅ Text post created successfully');
            console.log('Post structure:', textPostResult.data.data.post);
        } else {
            console.error('❌ Text post creation failed');
        }

        // 3. Test creating an image post
        console.log('\n3. Testing image post creation...');
        const imagePostResult = await makeRequest('/server/posts/create', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                type: 'image',
                image_url: 'https://example.com/test-image.jpg',
                caption: 'This is a test image',
                date: new Date().toISOString()
            })
        });

        if (imagePostResult.data.success) {
            console.log('✅ Image post created successfully');
            console.log('Post structure:', imagePostResult.data.data.post);
        } else {
            console.error('❌ Image post creation failed');
        }

        // 4. Test creating a mixed post
        console.log('\n4. Testing mixed post creation...');
        const mixedPostResult = await makeRequest('/server/posts/create', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                type: 'mixed',
                content: 'Check out this amazing photo!',
                image_url: 'https://example.com/amazing-photo.jpg',
                caption: 'Amazing sunset view',
                date: new Date().toISOString()
            })
        });

        if (mixedPostResult.data.success) {
            console.log('✅ Mixed post created successfully');
            console.log('Post structure:', mixedPostResult.data.data.post);
        } else {
            console.error('❌ Mixed post creation failed');
        }

        // 5. Test getting user posts
        console.log('\n5. Testing get user posts...');
        const userPostsResult = await makeRequest('/server/posts/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (userPostsResult.data.success) {
            console.log('✅ User posts retrieved successfully');
            console.log('Number of posts:', userPostsResult.data.data.posts.length);
            console.log('First post structure:', userPostsResult.data.data.posts[0]);
        } else {
            console.error('❌ Failed to retrieve user posts');
        }

        // 6. Test search posts
        console.log('\n6. Testing search posts...');
        const searchResult = await makeRequest('/server/posts/search', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                names: ['testuser'],
                page: 1,
                limit: 10
            })
        });

        if (searchResult.data.success) {
            console.log('✅ Search posts successful');
            console.log('Found posts:', searchResult.data.data.posts.length);
            if (searchResult.data.data.posts.length > 0) {
                console.log('First search result structure:', searchResult.data.data.posts[0]);
            }
        } else {
            console.error('❌ Search posts failed');
        }

        console.log('\n🎉 All tests completed!');

    } catch (error) {
        console.error('❌ Test failed with error:', error);
    }
}

// Run the test
testRefactoredPosts();
