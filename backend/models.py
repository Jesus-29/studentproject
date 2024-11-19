from config import db
from datetime import datetime

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)  
    priority = db.Column(db.String(10), nullable=False)

    VALID_PRIORITIES = ['low', 'medium', 'high']

    def __init__(self, **kwargs):
        super(Task, self).__init__(**kwargs)
        if self.priority.lower() not in self.VALID_PRIORITIES:
            raise ValueError(f"Priority must be one of: {', '.join(self.VALID_PRIORITIES)}")



    def to_json(self):
        return {
            "id": self.id,
            "title": self.title,
            "category": self.category,
            "start_time": self.start_time.isoformat(),
            "end_time": self.end_time.isoformat(),
            "priority": self.priority    
        }
