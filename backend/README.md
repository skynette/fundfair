# FundFair Server Setup

Welcome to FundFair Server! This guide will help you set up your development environment, start the development server, and locate the API documentation.

## Prerequisites

Before starting, make sure you have Python 3.8 or newer and pip installed on your machine. You can check your Python version by running:

```bash
python --version
```
If Python is not installed, download and install it from python.org.

## Setting Up the Virtual Environment

To avoid conflicts with other Python projects or system-level packages, we use a virtual environment. To set up a virtual environment for this project, follow these steps:

1.  Open your terminal or command prompt.
    
2.  Navigate to the server directory:

	```bash
	cd backend/
	```

3. Create a virtual environment:
	```bash
	python -m venv venv
	```
4. Activate the virtual environment:

   On Windows:
	```bash
	.\venv\Scripts\activate
	```
	On macOS and Linux:
	```bash
	source venv/bin/activate
	```
1.  After activation, your command prompt should include `(venv)`.
    

## Installing Project Requirements

With your virtual environment activated, install the project dependencies using:
```bash
pip install -r requirements.txt
```
This command reads the `requirements.txt` file and installs all the necessary Python packages.

## Starting the Development Server

Once the requirements are installed, you can start the Django development server by running:
```bash
python manage.py runserver
```
By default, the server runs on http://127.0.0.1:8000/. You can access it using your web browser.

## Locating the API Documentation

The API documentation is typically available in one of the following ways:

1.  **Built-in Swagger or Redoc**: If the project uses DRF (Django Rest Framework) and has Swagger or Redoc integrated, you can usually find the API documentation at:
    -   Schema: http://127.0.0.1:8000/api/schema/
    -   Swagger: http://127.0.0.1:8000/api/docs/
    -   Redoc: http://127.0.0.1:8000/api/redoc/
2.  **Postman Collection**: you can import the api schema into postman to create a collection
    