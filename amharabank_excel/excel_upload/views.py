from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import pandas as pd
import cx_Oracle
import os
import re
import tempfile

# Explicitly point cx_Oracle to the Instant Client on Windows to avoid DPI-1047
try:
    cx_Oracle.init_oracle_client(lib_dir=r"C:\instantclient_21_19")
except Exception:
    # If it is already initialized or the directory is wrong, cx_Oracle will
    # raise here; in that case the normal DPI-1047 error will still be reported
    # from the connection call, which we surface as a readable JSON error.
    pass


def _sanitize_oracle_identifier(name: str) -> str:
    """
    Turn an arbitrary Excel header or table name into a safe Oracle identifier.
    - Uppercases
    - Replaces invalid chars with underscores
    - Ensures it starts with a letter or underscore, otherwise prefixes with 'C_'
    """
    name = (name or "").strip().upper()
    if not name:
        return ""

    # Replace any character that is not letter, digit, or underscore with underscore
    name = re.sub(r"[^A-Z0-9_]", "_", name)

    # Ensure it starts with a letter or underscore
    if not re.match(r"^[A-Z_]", name):
        name = f"C_{name}"

    return name


@csrf_exempt
def upload_excel(request):
    if request.method != 'POST':
        return JsonResponse({
            'status': 'error',
            'message': 'Invalid request method. Only POST allowed.'
        }, status=405)

    try:
        # Check if file is present in request
        if 'file' not in request.FILES:
            return JsonResponse({
                'status': 'error',
                'message': 'No file provided'
            }, status=400)

        uploaded_file = request.FILES['file']

        # Check file extension
        if not uploaded_file.name.endswith(('.xlsx', '.xls')):
            return JsonResponse({
                'status': 'error',
                'message': 'Invalid file format. Please upload .xlsx or .xls file.'
            }, status=400)

        # Optional table name from UI - if provided, we create/populate that table
        raw_table_name = request.POST.get('table_name', '').strip()
        table_name = _sanitize_oracle_identifier(raw_table_name) if raw_table_name else ''

        if raw_table_name and not table_name:
            return JsonResponse({
                'status': 'error',
                'message': 'Invalid table name provided.'
            }, status=400)

        # Save file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx') as tmp_file:
            for chunk in uploaded_file.chunks():
                tmp_file.write(chunk)
            tmp_file_path = tmp_file.name

        try:
            # Read Excel file with pandas
            df = pd.read_excel(tmp_file_path)

            if df.empty:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Excel file has no rows to import.'
                }, status=400)

            # Connect to Oracle database
            # In this environment ORACLE_SERVICE holds the SID (e.g. DWLIVE),
            # so we pass it as sid rather than service_name.
            dsn = cx_Oracle.makedsn(
                settings.ORACLE_HOST,
                settings.ORACLE_PORT,
                sid=settings.ORACLE_SERVICE
            )

            connection = cx_Oracle.connect(
                user=settings.ORACLE_USER,
                password=settings.ORACLE_PASSWORD,
                dsn=dsn
            )

            cursor = connection.cursor()

            # If a table name is provided, create/populate that table dynamically
            if table_name:
                # Build safe column names from Excel headers
                original_columns = list(df.columns)
                if not original_columns:
                    return JsonResponse({
                        'status': 'error',
                        'message': 'Excel file has no columns.'
                    }, status=400)

                oracle_columns = []
                seen = set()
                for col in original_columns:
                    safe = _sanitize_oracle_identifier(str(col))
                    if not safe:
                        # Fallback generic column name
                        safe = f"COLUMN_{len(oracle_columns) + 1}"

                    # Ensure uniqueness
                    base = safe
                    counter = 1
                    while safe in seen:
                        safe = f"{base}_{counter}"
                        counter += 1

                    seen.add(safe)
                    oracle_columns.append(safe)

                # Create table if it does not already exist
                columns_sql = ", ".join(f"{col} VARCHAR2(4000)" for col in oracle_columns)
                create_sql = f"CREATE TABLE {table_name} ({columns_sql})"
                try:
                    cursor.execute(create_sql)
                except cx_Oracle.DatabaseError as e:
                    error_obj, = e.args
                    # ORA-00955: name is already used by an existing object
                    if error_obj.code != 955:
                        raise

                # Prepare dynamic insert statement
                placeholders = ", ".join(f":{i+1}" for i in range(len(oracle_columns)))
                insert_sql = f"INSERT INTO {table_name} ({', '.join(oracle_columns)}) VALUES ({placeholders})"

                for _, row in df.iterrows():
                    values = []
                    for orig_col in original_columns:
                        v = row[orig_col]
                        if pd.isna(v):
                            v = None
                        else:
                            v = str(v)
                        values.append(v)
                    cursor.execute(insert_sql, values)

                connection.commit()
                cursor.close()
                connection.close()

                # Clean up temporary file
                os.unlink(tmp_file_path)

                return JsonResponse({
                    'status': 'success',
                    'message': f'Excel data inserted into Oracle table {table_name}.'
                })

            # Fallback: original fixed-table behaviour (my_table with col1/2/3)
            required_columns = ['col1', 'col2', 'col3']
            if not all(col in df.columns for col in required_columns):
                missing_cols = [col for col in required_columns if col not in df.columns]
                return JsonResponse({
                    'status': 'error',
                    'message': f'Missing required columns: {", ".join(missing_cols)}'
                }, status=400)

            for _, row in df.iterrows():
                cursor.execute(
                    "INSERT INTO my_table (col1, col2, col3) VALUES (:1, :2, :3)",
                    [row['col1'], row['col2'], row['col3']]
                )

            connection.commit()
            cursor.close()
            connection.close()

            # Clean up temporary file
            os.unlink(tmp_file_path)

            return JsonResponse({
                'status': 'success',
                'message': 'Excel data inserted into Oracle.'
            })

        except Exception as e:
            # Clean up temporary file
            if os.path.exists(tmp_file_path):
                os.unlink(tmp_file_path)

            return JsonResponse({
                'status': 'error',
                'message': f'Database error: {str(e)}'
            }, status=500)

    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': f'Server error: {str(e)}'
        }, status=500)