from flask import request, jsonify
from config import app, db
from models import Task
from datetime import datetime

@app.route("/tasks", methods=["GET"])
def get_tasks():
    priority_order = {
        'low': 3,
        'medium': 2,
        'high': 1
    }
    tasks = Task.query.all()
    tasks.sort(key=lambda task: priority_order.get(task.priority, 0))
    json_tasks = [task.to_json() for task in tasks]

    return jsonify({"tasks": json_tasks})


@app.route("/create_task", methods=["POST"])
def create_task():
    try:
        data = request.json
        title = data.get("title")
        category = data.get("category")
        start_time = data.get("start_time")
        end_time = data.get("end_time")
        priority = data.get("priority", "").lower()

        # Validate required fields
        if not all([title, category, start_time, end_time, priority]):
            return (
                jsonify({"message": "All fields are required: title, category, start_time, end_time, and priority"}),
                400,
            )

        # Validate priority
        if priority not in Task.VALID_PRIORITIES:
            return (
                jsonify({"message": f"Priority must be one of: {', '.join(Task.VALID_PRIORITIES)}"}),
                400,
            )

        # Parse time values from string to time objects
        try:
            start_time = datetime.strptime(start_time, '%H:%M').time()  # Parsing time
            end_time = datetime.strptime(end_time, '%H:%M').time()      # Parsing time
        except ValueError:
            return jsonify({"message": "Invalid time format. Use HH:MM"}), 400
        
        # Check for time overlap
        existing_tasks = Task.query.all()
        for task in existing_tasks:
            if task.start_time < end_time and task.end_time > start_time:
                return jsonify({"message": "Task overlaps with existing task"}), 400


        # Create new task
        new_task = Task(
            title=title,
            category=category,
            start_time=start_time,
            end_time=end_time,
            priority=priority
        )

        db.session.add(new_task)
        db.session.commit()
        return jsonify({"message": "Task Created!", "task": new_task.to_json()}), 201

    except ValueError as e:
        return jsonify({"message": str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

@app.route("/update_task/<int:task_id>", methods=["PATCH"])
def update_task(task_id):
    try:
        task = Task.query.get(task_id)
        if not task:
            return jsonify({"message": "Task not found"}), 404
        
        data = request.json
        if "title" in data:
            task.title = data["title"]
        if "category" in data:
            task.category = data["category"]
        
        # Handle time updates (not dates)
        if "start_time" in data:
            try:
                task.start_time = datetime.strptime(data["start_time"], '%H:%M').time()  # Parsing time
            except ValueError:
                return jsonify({"message": "Invalid start time format. Use HH:MM"}), 400
                
        if "end_time" in data:
            try:
                task.end_time = datetime.strptime(data["end_time"], '%H:%M').time()  # Parsing time
            except ValueError:
                return jsonify({"message": "Invalid end time format. Use HH:MM"}), 400
        
        # Check for time overlap
        existing_tasks = Task.query.filter(Task.id != task_id).all()
        for existing_task in existing_tasks:
            if existing_task.start_time < task.end_time and existing_task.end_time > task.start_time:
                return jsonify({"message": "Task overlaps with existing task"}), 400
        
        # Validate that the end time is after the start time (if both are provided)
        if task.end_time < task.start_time:
            return jsonify({"message": "End time cannot be before start time"}), 400
            
        if "priority" in data:
            priority = data["priority"].lower()
            if priority not in Task.VALID_PRIORITIES:
                return jsonify({"message": f"Priority must be one of: {', '.join(Task.VALID_PRIORITIES)}"}), 400
            task.priority = priority

        db.session.commit()
        return jsonify({"message": "Task updated", "task": task.to_json()}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

@app.route("/delete_task/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    try:
        task = Task.query.get(task_id)
        if not task:
            return jsonify({"message": "Task not found"}), 404
        
        db.session.delete(task)
        db.session.commit()
        return jsonify({"message": "Task deleted"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)

'''

from flask import request, jsonify
from config import app, db
from models import Task

@app.route("/tasks", methods=["GET"])
def get_tasks():
    tasks = Task.query.all()
    json_tasks = list(map(lambda x: x.to_json(), tasks))
    return jsonify({"tasks": json_tasks})

@app.route("/create_task", methods=["POST"])
def create_task():
    title = request.json.get("title")
    category = request.json.get("category")
    start_time = request.json.get("start_time")
    end_time = request.json.get("end_time")
    priority = request.json.get("priority")

    if not title or not category or not start_time or not end_time or not priority:
        return (
            jsonify({"message": "You must include a user_id, title, category, start_time, end_time and priority"}),
            400,
        )
    new_task = Task(title=title, category=category, start_time=start_time, end_time=end_time, priority=priority)
    try:
        db.session.add(new_task)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "Task Created!"}), 201

@app.route("/update_task/<int:task_id>", methods=["PATCH"])
def update_task(task_id):
    task = Task.query.get(task_id)

    if not task:
        return jsonify({"message": "Task not found"})
    
    data = request.json
    task.title = data.get("title", task.title)
    task.category = data.get("category", task.category)
    task.start_time = data.get("start_time", task.start_time)
    task.end_time = data.get("end_time", task.end_time)
    task.priority = data.get("priority", task.priority)

    db.session.commit()

    return jsonify({"message": "Task updated"}), 200

@app.route("/delete_task/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    task = Task.query.get(task_id)

    if not task:
        return jsonify({"message": "Task not found"})
    
    db.session.delete(task)
    db.session.commit()
    
    return jsonify({"message": "Task deleted"}), 200

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
# In the code above, we have defined the routes for the User and Task models. We have defined the following routes:
'''
