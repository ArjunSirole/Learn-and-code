import java.util.ArrayList;
import java.util.InputMismatchException;
import java.util.Scanner;

class Task {
    private final String description;
    private boolean isComplete;

    public Task(String description) {
        this.description = description;
        this.isComplete = false;
    }

    public void markComplete() {
        this.isComplete = true;
    }

    public boolean isComplete() {
        return isComplete;
    }

    public String getDescription() {
        return description;
    }
}

class TaskManager {
    private final ArrayList<Task> tasks = new ArrayList<>();

    public void addTask(String description) {
        tasks.add(new Task(description));
    }

    public boolean removeTask(int index) {
        if (isValidIndex(index)) {
            tasks.remove(index);
            return true;
        }
        return false;
    }

    public boolean markTaskComplete(int index) {
        if (isValidIndex(index)) {
            tasks.get(index).markComplete();
            return true;
        }
        return false;
    }

    public void listTasks() {
        if (tasks.isEmpty()) {
            System.out.println("No tasks available");
        } else {
            for (int i = 0; i < tasks.size(); i++) {
                Task task = tasks.get(i);
                System.out.println((i + 1) + ". " + (task.isComplete() ? "[✔] " : "[ ] ") + task.getDescription());
            }
        }
    }

    public int getTaskCount() {
        return tasks.size();
    }

    private boolean isValidIndex(int index) {
        return index >= 0 && index < tasks.size();
    }
}

public class TodoApp {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        TaskManager taskManager = new TaskManager();

        while (true) {
            showMenu();
            int userChoice = getUserChoice(scanner);
            switch (userChoice) {
                case 1 -> addTask(scanner, taskManager);
                case 2 -> handleTaskOperation(scanner, taskManager, "remove");
                case 3 -> handleTaskOperation(scanner, taskManager, "complete");
                case 4 -> taskManager.listTasks();
                case 5 -> {
                    System.out.println("Bye!");
                    scanner.close();
                    return;
                }
                default -> System.out.println("Invalid option, try again.");
            }
        }
    }

    private static void showMenu() {
        System.out.println("\n1. Add Task");
        System.out.println("2. Remove Task");
        System.out.println("3. Mark Task as Done");
        System.out.println("4. List Tasks");
        System.out.println("5. Exit");
        System.out.print("> ");
    }

    private static int getUserChoice(Scanner scanner) {
        try {
            return Integer.parseInt(scanner.nextLine().trim());
        } catch (NumberFormatException e) {
            return -1; 
        }
    }

    private static void addTask(Scanner scanner, TaskManager taskManager) {
        System.out.print("Enter task description: ");
        String description = scanner.nextLine().trim();
        if (description.isEmpty()) {
            System.out.println("Task description cannot be empty.");
        } else {
            taskManager.addTask(description);
            System.out.println("Task added.");
        }
    }

    private static void handleTaskOperation(Scanner scanner, TaskManager taskManager, String operation) {
        taskManager.listTasks();
        if (taskManager.getTaskCount() == 0) return;

        int index = getTaskIndexFromUser(scanner, taskManager.getTaskCount(), operation);
        if (index == -1) return;

        boolean success = switch (operation) {
            case "remove" -> taskManager.removeTask(index);
            case "complete" -> taskManager.markTaskComplete(index);
            default -> false;
        };

        if (!success) {
            System.out.println("Invalid task number.");
        } else {
            System.out.println("Task " + (operation.equals("remove") ? "removed." : "marked as complete."));
        }
    }

    private static int getTaskIndexFromUser(Scanner scanner, int maxIndex, String action) {
        System.out.print("Enter task number to " + action + ": ");
        try {
            int taskNumber = Integer.parseInt(scanner.nextLine().trim());
            if (taskNumber < 1 || taskNumber > maxIndex) {
                System.out.println("Task number out of range.");
                return -1;
            }
            return taskNumber - 1;
        } catch (NumberFormatException e) {
            System.out.println("Invalid number.");
            return -1;
        }
    }
}
