# Amhara Bank Excel Upload Portal

This is a web application that allows users to upload Excel files which are then processed and inserted into an Oracle database.

## Project Structure

- `amharabank_excel/` - Django backend project (manage.py lives here)
- `frontend/` - React frontend application

## Backend Setup (Django)

1. Navigate to the backend directory (where `manage.py` is):
   ```
   cd amharabank_excel
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```
     source venv/bin/activate
     ```

4. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Set up Oracle database environment variables so Django can connect with `cx_Oracle`.

   - **On Windows (PowerShell)**:
     ```powershell
     $env:ORACLE_USER="your_username"
     $env:ORACLE_PASSWORD="your_password"
     $env:ORACLE_HOST="your_host"
     $env:ORACLE_PORT="1521"        # default is 1521
     $env:ORACLE_SERVICE="your_service_name"
     ```

   - **On macOS/Linux (bash/zsh)**:
     ```bash
     export ORACLE_USER=your_username
     export ORACLE_PASSWORD=your_password
     export ORACLE_HOST=your_host
     export ORACLE_PORT=1521        # default is 1521
     export ORACLE_SERVICE=your_service_name
     ```

6. Run database migrations:
   ```
   python manage.py migrate
   ```

7. Start the Django development server:
   ```
   python manage.py runserver
   ```

The backend will be available at `http://localhost:8000`

## Frontend Setup (React)

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## Usage

1. Open the frontend in your browser (`http://localhost:5173`).
2. Click **"Choose Excel file"** to select an Excel file (`.xlsx` or `.xls`).
3. Click **"Upload Excel"** to send the file to the backend (`http://localhost:8000/api/upload-excel/`).
4. The backend will validate required columns, process the file with `pandas`, and insert data into the Oracle database via `cx_Oracle`.

## Excel File Requirements

The Excel file must contain the following columns:
- col1
- col2
- col3

## Oracle Database Setup

Ensure you have:
1. An Oracle database instance running
2. A table named `my_table` with columns `col1`, `col2`, and `col3`
3. Proper credentials to connect to the database

Example table creation SQL:
```sql
CREATE TABLE my_table (
    col1 VARCHAR2(255),
    col2 VARCHAR2(255),
    col3 VARCHAR2(255)
);
```