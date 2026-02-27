import { useState } from 'react';
import TD from '../CSS/TaskDashboard.module.css';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TaskDashboard = () => {
    const Navigate = useNavigate()
    const location = useLocation()
    const [tasks, setTasks] = useState([])
    const [isSubTaskAdded, setIsSubTaskAdded] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        priorityLevel: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [showSubtaskForm, setShowSubtaskForm] = useState(false);
    const [showDependencyForm, setShowDependencyForm] = useState(false);
    const [subtasks, setSubtasks] = useState([]);
    const [dependencies, setDependencies] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [sTitle, setSTitle] = useState('');

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const errors = {};
        if (!formData.title.trim()) {
            errors.title = 'Title is required';
        }
        if (!formData.dueDate) {
            errors.dueDate = "Due date is required"
        }
        if (!formData.priorityLevel) {
            errors.priorityLevel = "Priority is required"
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Create new task
    const handleCreateTask = () => {
        if (!validateForm()) return;

        const newTask = {
            User_ID: location.state.User_ID,
            title: formData.title,
            description: formData.description,
            dueDate: formData.dueDate,
            priorityLevel: formData.priorityLevel,
        }

        axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/addtasks`, newTask).then((res) => {
            axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/tasks/${res.data.id}/subtasks`, { title: subtasks[0].title }).then((res) => {
                if (res.status !== 200) {
                    alert(res.data.message)
                } else {
                    setFormData({
                        title: '',
                        description: '',
                        dueDate: '',
                        priorityLevel: '',
                    });
                    setSubtasks([]);
                    setDependencies([]);
                    setShowSubtaskForm(false);
                    setShowDependencyForm(false);
                    setIsSubTaskAdded(false)
                    Navigate('/home', { state: location.state })
                }
            }).catch((err) => {
                console.log("Subtask adding error", err)
            })
        }).catch((err) => {
            console.log("Task adding error", err)
        })
    };

    // Add subtask to form
    const handleAddSubtask = () => {
        if (sTitle.trim()) {
            setSubtasks(prev => [...prev, {
                title: sTitle.trim(),
            }]);
            setIsSubTaskAdded(true)
            setSTitle('');
        }
    };

    // Remove subtask from form
    const handleRemoveSubtask = (index) => {
        setSubtasks(prev => prev.filter((_, i) => i !== index));
        setIsSubTaskAdded(false)
    };

    // Add dependency to form
    const handleAddDependency = (taskId) => {
        if (taskId && !dependencies.includes(parseInt(taskId))) {
            setDependencies(prev => [...prev, parseInt(taskId)]);
        }
    };

    // Remove dependency from form
    const handleRemoveDependency = (taskId) => {
        setDependencies(prev => prev.filter(id => id !== taskId));
    };

    // Edit task
    const handleEditTask = (task) => {
        setEditingTask(task.Task_ID);
        setFormData({
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            priorityLevel: task.priorityLevel,
        });
        localStorage.setItem("Task_ID", JSON.stringify(task.Task_ID))
        setSubtasks([...task.subTask])
        setShowSubtaskForm(task.subTask.length > 0);
        setIsSubTaskAdded(task.subTask.length > 0)
    };

    // Update existing task
    const handleUpdateTask = () => {
        if (!validateForm()) return;

        const payload = {
            title: formData.title,
            description: formData.description,
            dueDate: formData.dueDate,
            priorityLevel: formData.priorityLevel,
            subTaskStatus: subtasks.title,
            subTaskStatus: subtasks.status
        }

        const id = JSON.parse(localStorage.getItem('Task_ID'))

        axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/tasks/${id}`, payload).then((res) => {
            setEditingTask(null);
            setFormData({
                title: '',
                description: '',
                dueDate: '',
                priorityLevel: '',
            });
            setSubtasks([]);
            setDependencies([]);
            setShowSubtaskForm(false);
            setShowDependencyForm(false);
            localStorage.removeItem("Task_ID")
            console.log(res.data.message)
        }).catch((err) => {
            console.log(err)
        })
    };

    // Cancel edit
    const handleCancelEdit = () => {
        setEditingTask(null);
        setFormData({
            title: '',
            description: '',
            dueDate: '',
            priorityLevel: '',
        });
        setSubtasks([]);
        setDependencies([]);
        setShowSubtaskForm(false);
        setShowDependencyForm(false);
    };

    // Update task status (with subtask validation)
    const handleStatusChange = (taskId, newStatus) => {
        const task = tasks.find(t => t.Task_ID === taskId);

        // Defensive check in case task is undefined
        if (!task) return;

        // Defensive check for undefined subtasks
        const subtasks = Array.isArray(task.subTask) ? task.subTask : [];

        // Block completing task if subtasks are incomplete
        if (newStatus === 'Completed' && subtasks.length > 0) {
            const incompleteSubtasks = subtasks.filter(subtask => subtask.status !== 'Completed');
            if (incompleteSubtasks.length > 0) {
                alert('Cannot mark task as completed. Please complete all subtasks first.');
                return;
            }
        }

        // Update status via API and then update local state
        axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/tasks/${taskId}`, { status: newStatus })
            .then((res) => {
                setTasks(prev =>
                    prev.map(t =>
                        t.Task_ID === taskId
                            ? { ...t, status: newStatus }
                            : t
                    )
                );
            })
            .catch((err) => {
                console.error("Error updating status:", err);
            });
    };


    // Update subtask status
    const handleSubtaskStatusChange = (taskId, subtaskId, newStatus, title) => {

        axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/tasks/${taskId}`, { subTaskStatus: newStatus, subTaskTitle: title }).then((res) => {
            console.log(res.data.message)
        })
    };


    // Delete task
    const handleDeleteTask = (taskId) => {
        axios
            .delete(`${import.meta.env.VITE_API_BASE_URL}/api/tasks/${taskId}`)
            .then((res) => {
                if (res.status === 200) {
                    setTasks(prev => prev.filter(task => task.Task_ID !== taskId));
                } else {
                    alert(res.data?.message || 'Failed to delete task.');
                }
            })
            .catch((err) => {
                console.error('Delete task error:', err);
                alert('An error occurred while deleting the task.');
            });
    };


    // Check if task is blocked
    const isTaskBlocked = (task) => {
        if (!Array.isArray(task.dependencies)) return false;
        return task.dependencies.some(depId => {
            const depTask = tasks.find(t => t.id === depId);
            return depTask && depTask.status !== 'Completed';
        });
    };


    const getBlockingDependencies = (task) => {
        if (!Array.isArray(task.dependencies)) return [];
        return task.dependencies
            .map(depId => tasks.find(t => t.id === depId))
            .filter(depTask => depTask && depTask.status !== 'Completed');
    };

    const getDependentTasks = (task) => {
        if (!Array.isArray(task.dependents)) return [];
        return task.dependents
            .map(depId => tasks.find(t => t.id === depId))
            .filter(Boolean);
    };


    // Sort tasks by due date and priority
    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.dueDate && b.dueDate) {
            const dateComparison = new Date(a.dueDate) - new Date(b.dueDate);
            if (dateComparison !== 0) return dateComparison;
        }
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    // Calculate dashboard stats
    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'Completed').length,
        blocked: tasks.filter(t => isTaskBlocked(t)).length,
        inProgress: tasks.filter(t => t.status === 'In Progress').length
    };

    const handleLogOut = () => {
        localStorage.removeItem('taskToken')
        localStorage.removeItem('userId')
        Navigate('/')
    }

    useEffect(() => {
        if (localStorage.getItem('taskToken') === null) {
            Navigate('/')
        }

        const id = JSON.parse(localStorage.getItem("userId"))

        axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/tasks`, { User_ID: id}).then((res) => {
            setTasks(res.data.task)
        }).catch((err) => {
            console.log(err)
        })
    }, [handleCreateTask, handleEditTask, handleDeleteTask, handleUpdateTask])
    return (
        <div className={TD.container}>
            {/* Header */}
            <header className={TD.header}>
                <h1 className={TD.title}>Task Dashboard</h1>
                <button className={TD.logoutBtn} onClick={handleLogOut}>Logout</button>
            </header>

            {/* Main Content */}
            <main className={TD.mainContent}>
                {/* Task Creation Form */}
                <section className={TD.formSection}>
                    <h2 className={TD.sectionTitle}>
                        {editingTask ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    <form className={TD.form}>
                        <div className={TD.formGroup}>
                            <label className={TD.label}>Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title} required
                                onChange={handleInputChange}
                                className={`${TD.input} ${formErrors.title ? TD.inputError : ''}`}
                                placeholder="Enter task title"
                            />
                            {formErrors.title && <span className={TD.errorText}>{formErrors.title}</span>}
                        </div>

                        <div className={TD.formGroup}>
                            <label className={TD.label}>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className={TD.textarea}
                                placeholder="Enter task description"
                                rows="3"
                            />
                        </div>

                        <div className={TD.formGroup}>
                            <label className={TD.label}>Due Date</label>
                            <input
                                type="date"
                                name="dueDate" required
                                value={formData.dueDate}
                                onChange={handleInputChange}
                                className={TD.input}
                            />
                            {formErrors.dueDate && <span className={TD.errorText}>{formErrors.dueDate}</span>}
                        </div>

                        <div className={TD.formRow}>
                            <div className={TD.formGroup}>
                                <label className={TD.label}>Priority</label>
                                <select
                                    name="priorityLevel"
                                    value={formData.priorityLevel} required
                                    onChange={handleInputChange}
                                    className={TD.select}
                                >
                                    <option value=''>--Select Priority--</option>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                                {formErrors.priorityLevel && <span className={TD.errorText}>{formErrors.priorityLevel}</span>}
                            </div>
                        </div>

                        {/* Subtask Form */}
                        {showSubtaskForm && (
                            <div className={TD.formGroup}>
                                <label className={TD.label}>Subtasks</label>
                                <div className={TD.subtaskForm}>
                                    <div className={TD.subtaskInput}>
                                        <input
                                            type="text"
                                            name='stitle'
                                            value={sTitle} disabled={isSubTaskAdded}
                                            onChange={(e) => setSTitle(e.target.value)}
                                            placeholder="Enter subtask title"
                                            className={TD.input}
                                        />
                                        <button
                                            type="submit"
                                            onClick={handleAddSubtask}
                                            className={TD.addBtn}
                                            disabled={isSubTaskAdded}
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className={TD.subtaskList}>
                                        {subtasks.map((subtask, index) => (
                                            <div key={index} className={TD.subtaskItem}>
                                                <span>{subtask.title}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSubtask(index)}
                                                    className={TD.removeBtn}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Dependency Form */}
                        {showDependencyForm && (
                            <div className={TD.formGroup}>
                                <label className={TD.label}>Dependencies</label>
                                <div className={TD.dependencyForm}>
                                    <select
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                handleAddDependency(e.target.value);
                                                e.target.value = '';
                                            }
                                        }}
                                        className={TD.select}
                                        defaultValue=""
                                    >
                                        <option value="">Select a task to depend on</option>
                                        {tasks
                                            .filter(task => task.Task_ID !== editingTask)
                                            .map(task => (
                                                <option key={task.Task_ID} value={task.Task_ID}>
                                                    {task.title}
                                                </option>
                                            ))}
                                    </select>
                                    <div className={TD.dependencyList}>
                                        {dependencies.map(depId => {
                                            const depTask = tasks.find(t => t.id === depId);
                                            return depTask ? (
                                                <div key={depId} className={TD.dependencyItem}>
                                                    <span>{depTask.title}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveDependency(depId)}
                                                        className={TD.removeBtn}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ) : null;
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className={TD.formActions}>
                            {editingTask ? (
                                <>
                                    <button
                                        type="button"
                                        className={TD.primaryBtn}
                                        onClick={handleUpdateTask}
                                    >
                                        Update Task
                                    </button>
                                    <button
                                        type="button"
                                        className={TD.cancelBtn}
                                        onClick={handleCancelEdit}
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    className={TD.primaryBtn}
                                    onClick={handleCreateTask}
                                >
                                    Create Task
                                </button>
                            )}
                            <button
                                type="button"
                                className={TD.secondaryBtn}
                                onClick={() => setShowSubtaskForm(!showSubtaskForm)}
                            >
                                {showSubtaskForm ? 'Hide' : 'Add'} Subtask
                            </button>
                            <button
                                type="button"
                                className={TD.secondaryBtn}
                                onClick={() => setShowDependencyForm(!showDependencyForm)}
                            >
                                {showDependencyForm ? 'Hide' : 'Add'} Dependency
                            </button>
                        </div>
                    </form>
                </section>

                {/* Task List */}
                <section className={TD.taskSection}>
                    <h2 className={TD.sectionTitle}>Tasks</h2>

                    {/* Dashboard Stats */}
                    <div className={TD.statsContainer}>
                        <div className={TD.statCard}>
                            <span className={TD.statValue}>{stats.total}</span>
                            <span className={TD.statLabel}>Total</span>
                        </div>
                        <div className={TD.statCard}>
                            <span className={TD.statValue}>{stats.completed}</span>
                            <span className={TD.statLabel}>Completed</span>
                        </div>
                        <div className={TD.statCard}>
                            <span className={TD.statValue}>{stats.blocked}</span>
                            <span className={TD.statLabel}>Blocked</span>
                        </div>
                        <div className={TD.statCard}>
                            <span className={TD.statValue}>{stats.inProgress}</span>
                            <span className={TD.statLabel}>In Progress</span>
                        </div>
                    </div>

                    {/* Task List */}
                    <div className={TD.taskList}>
                        {sortedTasks.map(task => {
                            const blocked = isTaskBlocked(task);
                            const blockingDeps = getBlockingDependencies(task);
                            const dependents = getDependentTasks(task);

                            return (
                                <div key={task.Task_ID} className={`${TD.taskCard} ${TD[task.status.toLowerCase().replace(' ', '')]} ${blocked ? TD.blocked : ''}`}>
                                    <div className={TD.taskHeader}>
                                        <h3 className={TD.taskTitle}>{task.title}</h3>
                                        <div className={TD.taskMeta}>
                                            <span className={`${TD.priorityLevel} ${TD[task.priorityLevel.toLowerCase()]}`}>
                                                {task.priorityLevel}
                                            </span>
                                            <span className={TD.dueDate}>{task.dueDate || 'No due date'}</span>
                                        </div>
                                    </div>

                                    {task.description && (
                                        <p className={TD.taskDescription}>{task.description}</p>
                                    )}

                                    <div className={TD.taskStatus}>
                                        <label className={TD.statusLabel}>Status:</label>
                                        <select
                                            value={task.status}
                                            onChange={(e) => handleStatusChange(task.Task_ID, e.target.value)}
                                            className={TD.statusSelect}
                                            disabled={blocked || task.status === "Completed"}
                                        >
                                            <option value="To Do">To Do</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>

                                    {/* Subtasks */}
                                    {Array.isArray(task.subTask) && task.subTask.length > 0 && (
                                        <div className={TD.subtasks}>
                                            <h4 className={TD.subtaskTitle}>Subtasks:</h4>
                                            {task.subTask.map(subtask => (
                                                <div key={subtask.subTask_ID} className={`${TD.subtask} ${TD[subtask.status.toLowerCase().replace(' ', '')]}`}>
                                                    <span className={TD.subtaskName}>{subtask.title}</span>
                                                    <div className={TD.subtaskActions}>
                                                        <select
                                                            disabled={task.status === "Completed"}
                                                            value={subtask.status}
                                                            onChange={(e) => handleSubtaskStatusChange(task.Task_ID, subtask.subTask_ID, e.target.value, subtask.title)}
                                                            className={TD.subtaskStatusSelect}
                                                        >
                                                            <option value="To Do">To Do</option>
                                                            <option value="In Progress">In Progress</option>
                                                            <option value="Completed">Completed</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Dependencies */}
                                    {blocked && (
                                        <div className={TD.dependencies}>
                                            <h4 className={TD.dependencyTitle}>Blocked by:</h4>
                                            {blockingDeps.map(dep => (
                                                <div key={dep.id} className={TD.dependency}>
                                                    {dep.title} ({dep.status})
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Dependents */}
                                    {dependents.length > 0 && (
                                        <div className={TD.dependents}>
                                            <h4 className={TD.dependentTitle}>Blocking:</h4>
                                            {dependents.map(dep => (
                                                <div key={dep.id} className={TD.dependent}>
                                                    {dep.title}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className={TD.taskActions}>
                                        <button
                                            disabled={task.status === "In Progress" || task.status === "Completed"}
                                            className={`${TD.editBtn} ${task.status === "In Progress" ? TD.blocked : task.status === "Completed" ? TD.blocked : ""}`}
                                            onClick={() => handleEditTask(task)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className={TD.deleteBtn}
                                            onClick={() => handleDeleteTask(task.Task_ID)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default TaskDashboard;