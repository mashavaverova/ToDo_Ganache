import { useState } from "react";

export const AddTodo = ({ writeContract, populateTodos }) => {
    const [todo, setTodo] = useState({ text: "", completed: false });

    const createTodo = async () => {
        try {
           //console.log("Creating todo:", todo);
            const result = await writeContract.createTodo(todo.text);
         console.log("Create todo result:", result);
            await result.wait();

            populateTodos();
         //   console.log("Todos updated after creating todo.");
        } catch (err) {
            console.error("Error creating todo:", err);
        }
    };

    const handleChange = (e) => {
        setTodo({
            ...todo,
            [e.target.name]: e.target.value
        });
    };

    return (
        <form className="add-todoForm"
            onSubmit={(e) => {
                e.preventDefault();
                createTodo();
            }}
        >
            <input className="addText"
                type="text"
                name="text"
                placeholder="Enter Todo"
                value={todo.text}
                onChange={handleChange}
            />

            <button className="addButton" type="submit">Add Todo</button>
        </form>
    );
};