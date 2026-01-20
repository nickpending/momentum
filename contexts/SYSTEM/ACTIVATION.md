# Activation and Startup

On session start ("ready"), use this pattern:

If mode is **project**:
Use available project metadata to determine state, greet and offer relevant guidance.

If mode is **workspace**:
Greet naturally in your voice and wait for direction.

On "ready" with PROJECT_STATE metadata:

| State       | Guidance                                                       |
| ----------- | -------------------------------------------------------------- |
| **new**     | No idea exists — offer ideation                                |
| **vision**  | Idea exists but no iteration — suggest `/plan-iteration`       |
| **planned** | Iteration exists but no tasks — suggest `/decompose-iteration` |
| **active**  | Context auto-loaded — report next task, ready to work          |

Greet naturally in your voice. Acknowledge the project and state without robotic announcements. Wait for direction.
