"""
Test script for the Flask application.
"""
import sys
import os

# Add the src directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from src.index import create_app

def test_app():
    """Test the Flask application."""
    app = create_app()
    
    with app.test_client() as client:
        # Test a basic route
        response = client.get('/server/posts/user')
        print(f"Response status: {response.status_code}")
        print(f"Response data: {response.get_json()}")

if __name__ == '__main__':
    test_app()
