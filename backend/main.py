from flask import request, jsonify
from config import app, db
from models import Contact

# GET /contacts - list
@app.route("/contacts", methods=["GET"])
def get_contacts():
    contacts = Contact.query.all()
    return jsonify({"contacts": [c.to_json() for c in contacts]}), 200

# POST /contacts - create
@app.route("/contacts", methods=["POST"])
def create_contact():
    data = request.get_json(silent=True) or {}
    first_name = data.get("firstName")
    last_name = data.get("lastName")
    email = data.get("email")

    if not first_name or not last_name or not email:
        return jsonify({"message": "You must include a first name, last name and email!"}), 400

    new_contact = Contact(first_name=first_name, last_name=last_name, email=email)
    try:
        db.session.add(new_contact)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        msg = str(e)
        status = 409 if "UNIQUE constraint" in msg or "duplicate key" in msg.lower() else 400
        return jsonify({"message": msg}), status

    return jsonify({"message": "User created!", "contact": new_contact.to_json()}), 201

# PATCH /contacts/<id> - update
@app.route("/contacts/<int:user_id>", methods=["PATCH"])
def update_contact(user_id):
    contact = Contact.query.get(user_id)
    if not contact:
        return jsonify({"message": "User not found!"}), 404

    data = request.get_json(silent=True) or {}
    contact.first_name = data.get("firstName", contact.first_name)
    contact.last_name = data.get("lastName", contact.last_name)
    contact.email = data.get("email", contact.email)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        msg = str(e)
        status = 409 if "UNIQUE constraint" in msg or "duplicate key" in msg.lower() else 400
        return jsonify({"message": msg}), status

    return jsonify({"message": "User updated!", "contact": contact.to_json()}), 200

# DELETE /contacts/<id> - delete
@app.route("/contacts/<int:user_id>", methods=["DELETE"])
def delete_contact(user_id):
    contact = Contact.query.get(user_id)
    if not contact:
        return jsonify({"message": "User not found!"}), 404

    try:
        db.session.delete(contact)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400

    return jsonify({"message": "User deleted!"}), 200


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)