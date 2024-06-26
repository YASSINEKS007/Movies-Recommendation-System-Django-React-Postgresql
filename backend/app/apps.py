from django.apps import AppConfig
from utils import get_db_handle

class AppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app'
    
    def ready(self):
        # Call the function to test the database connection
        get_db_handle()
