export const Todos = ({ todos, contract, populateTodos }) => {
    return (
        <div>
            {todos.map((t) => (
                <div key={t.id} className={`todo-item ${t.completed ? 'completed' : ''}`}>
                    <input className="toggle"
                        type="checkbox"
                        checked={t.completed}
                        onChange={async () => {
                            try {
                                const result = await contract.toggleTodo(t.id);
                                await result.wait();
                                populateTodos();
                            } catch (error) {
                                console.error("Error toggling todo:", error);
                            }
                        }}
                    />
                    <span className="text">{t.text}</span>
                    <button className="deleteButton"
                        onClick={async () => {
                            try {
                                const result = await contract.removeTodo(t.id);
                                await result.wait();
                                populateTodos();
                            } catch (error) {
                                console.error("Error removing todo:", error);
                            }
                        }}
                    >Delete </button>
                </div>
            ))}
        </div>
    );
};